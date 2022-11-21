import {
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { Server } from 'ws';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ namespace: 'voice', cors: true, transports: ['websocket', 'polling'] })
export class VoiceChatGateway implements OnGatewayInit, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    // 현재 사용중인 소켓들
    private activeSockets: { room: string; id: string }[] = [];

    private logger: Logger = new Logger('VoiceChatGateway');

    // 방에 입장
    @SubscribeMessage('joinRoom')
    public joinRoom(client: Socket, room: string): void {

        // 이미 존재하는지 판별
        const existingSocket = this.activeSockets?.find(
            (socket) => socket.room === room && socket.id === client.id,
        );

        // 이미 존재하는 것이 아니면 만들기
        if (!existingSocket) {
            this.activeSockets = [...this.activeSockets, { id: client.id, room }];
            client.emit(`${room}-update-user-list`, {
                users: this.activeSockets
                    .filter((socket) => socket.room === room && socket.id !== client.id)
                    .map((existingSocket) => existingSocket.id),
                current: client.id,
            });

            client.broadcast.emit(`${room}-add-user`, {
                user: client.id,
            });
        }
        return this.logger.log(`Client ${client.id} joined ${room}`);
    }

    @SubscribeMessage('call-user')
    public callUser(client: Socket, data: any): void {
        client.to(data.to).emit('call-made', {
            offer: data.offer,
            socket: client.id,
        });
    }

    @SubscribeMessage('make-answer')
    public makeAnswer(client: Socket, data: any): void {
        client.to(data.to).emit('answer-made', {
            socket: client.id,
            answer: data.answer,
        });
    }

    @SubscribeMessage('reject-call')
    public rejectCall(client: Socket, data: any): void {
        client.to(data.from).emit('call-rejected', {
            socket: client.id,
        });
    }

    public afterInit(server: Server): void {
        this.logger.log('Init');
    }

    public handleDisconnect(client: Socket): void {
        const existingSocket = this.activeSockets.find(
            (socket) => socket.id === client.id,
        );

        if (!existingSocket) return;

        // 현재 사용중인 소켓 배열에서 제거
        this.activeSockets = this.activeSockets.filter(
            (socket) => socket.id !== client.id,
        );

        client.broadcast.emit(`${existingSocket.room}-remove-user`, {
            socketId: client.id,
        });

        this.logger.log(`Client disconnected: ${client.id}`);
    }

}

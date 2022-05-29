import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
// import { Logger } from '@nestjs/common';

type Position = {
    x: number
    y: number
}

@WebSocketGateway({ cors: true })
export class DrawingGateway implements OnGatewayConnection, OnGatewayDisconnect {

    async handleConnection(): Promise<void> {
        this.users++;
        this.server.emit('users', this.users);
    }

    async handleDisconnect(): Promise<void> {
        this.users--;
        this.server.emit('users', this.users);
    }

    @WebSocketServer() server: any;
    users: number = 0;

    @SubscribeMessage('position')
    async onPosition(@MessageBody() data: Position): Promise<void> {
        this.server.emit('sposition', data);
    }
    
}
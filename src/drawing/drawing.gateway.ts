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
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: string
}

@WebSocketGateway({ cors: true })
export class DrawingGateway implements OnGatewayConnection, OnGatewayDisconnect {

    drClients=[];

    async handleConnection(client: any): Promise<void> {
        this.users++;
        this.drClients.push(client);
        this.server.emit('users', this.users);
    }

    async handleDisconnect(): Promise<void> {
        this.users--;
        this.server.emit('users', this.users);
    }

    @WebSocketServer() server: any;
    users: number = 0;
    
    @SubscribeMessage('draw')
    async onPosition(client: any, data: Position): Promise<void> {
        client.broadcast.emit('draw', data);
        // this.server.emit('sposition', data);
    }
}
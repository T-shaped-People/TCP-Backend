import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

  // 클라이언트 배열
  chatClients=[];

  async handleConnection(client: any): Promise<void> {
      this.users++;
      this.chatClients.push(client);
      this.server.emit('users', this.users);
  }

  async handleDisconnect(): Promise<void> {
      this.users--;
      this.server.emit('users', this.users);
  }

  @WebSocketServer() server: any;
  users: number = 0;
  
  @SubscribeMessage('chat')
  async onPosition(client: any, data): Promise<void> {
      client.broadcast.emit('chat', data);
  }
}
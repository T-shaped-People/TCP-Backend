import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

import { ChatService } from './chat.service';

// payload
type ChatMessage = {
  content: string,
  date: Date
}

@WebSocketGateway(80, { cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

  constructor(private readonly chatService: ChatService) {}

  chatClients=[];

  async handleConnection(client: any): Promise<void> {
      this.users++;
      this.chatClients.push(client);
      this.server.emit('users', this.users);
  }

  async handleDisconnect(client: any): Promise<void> {
      this.users--;
      this.server.emit('users', this.users);
  }

  @WebSocketServer() server: any;
  users: number = 0;
  
  @SubscribeMessage('chat')
  async onPosition(client: any, data: ChatMessage): Promise<void> {
      await this.chatService.createChat(data);
      client.broadcast.emit('chat', data);
  }
}
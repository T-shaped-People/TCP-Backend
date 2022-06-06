import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

// payload
type ChatMessage = {
  context: string,
  date: string
}

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

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
      client.broadcast.emit('chat', data);
  }
}
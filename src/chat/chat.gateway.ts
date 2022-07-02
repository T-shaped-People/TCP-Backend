import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { userInfo } from 'os';
import { Server, Socket } from 'socket.io';
import { User } from 'src/auth/user';
import { WSAuthUtil } from 'src/auth/WS-auth.util';

import { ChatService } from './chat.service';

// payload
type ChatMessage = {
  content: string,
  date: Date
}

@WebSocketGateway({
    namespace: 'chat',
    cors: true
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

    constructor(
        private readonly chatService: ChatService,
        private wsAuthUtil: WSAuthUtil
    ) {}

    @WebSocketServer()
    server: Server;

    private clients: {
        [index: string]: {
            user: User,
            socket: Socket
        }
    } = {};

    async handleConnection(client: Socket): Promise<void> {
        const userInfo = await this.wsAuthUtil.authClient(client);
        // 인증에 실패했다면
        if (!userInfo) {
            client.disconnect();
            return;
        }
        this.clients[client.id] = {
            user: userInfo,
            socket: client
        };
        
        this.server.emit('chat:user-join', {
            usercode: userInfo.usercode,
            nickname: userInfo.nickname
        });
    }

    async handleDisconnect(client: Socket): Promise<void> {
        const userInfo = this.clients[client.id]?.user;
        if (!userInfo) return;
        this.server.emit('chat:user-exit', {
            usercode: userInfo.usercode
        });
    }
    
    @SubscribeMessage('chat')
    async onPosition(client: Socket, data: ChatMessage): Promise<void> {
        // await this.chatService.createChat(data);
        client.broadcast.emit('chat', data);
    }
}
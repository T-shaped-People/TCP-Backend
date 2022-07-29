import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { User } from 'src/auth/user';
import { WSAuthUtil } from 'src/auth/WS-auth.util';
import { SaveChatDTO } from 'src/chat/dto/save-chat.dto';

import { ChatService } from './chat.service';

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
            client.emit('error', 'Unauthorized');
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
        delete this.clients[client.id];
    }
    
    @SubscribeMessage('chat')
    async onPosition(client: Socket, data: SaveChatDTO): Promise<void> {
        const userInfo = this.clients[client.id]?.user;
        if (!userInfo) return;
        const chatInfo = await this.chatService.saveChat(userInfo, data);
        this.server.to(chatInfo.roomId).emit('chat', chatInfo);
    }
}
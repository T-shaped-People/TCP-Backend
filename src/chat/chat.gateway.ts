import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { User } from 'src/auth/user';
import { WSAuthUtil } from 'src/auth/WS-auth.util';
import { ChatRoomJoinDto } from 'src/chat/dto/request/chat-room-join.dto';
import { SaveChatDTO } from 'src/chat/dto/request/save-chat.dto';

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
            socket: Socket,
            roomId?: string
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
    }

    async handleDisconnect(client: Socket) {
        const userInfo = this.clients[client.id]?.user;
        if (!userInfo) return;
        this.server.emit('chat:user-exit', {
            usercode: userInfo.usercode
        });
        delete this.clients[client.id];
    }
    
    @SubscribeMessage('chat:room-join')
    async joinRoom(client: Socket, data: ChatRoomJoinDto) {
        const clientInfo = this.clients[client.id];
        if (!clientInfo?.user) return;
        const {teamId, roomId, user} = {...data, ...clientInfo};
        clientInfo.roomId = (await this.chatService.getRoom(user, teamId, roomId)).id;

        client.join(clientInfo.roomId);
        this.server.to(clientInfo.roomId).emit('chat:user-join', {
            usercode: user.usercode,
            nickname: user.nickname
        });
    }

    @SubscribeMessage('chat')
    async chat(client: Socket, data: SaveChatDTO): Promise<void> {
        const userInfo = this.clients[client.id]?.user;
        if (!userInfo) return;
        const chatInfo = await this.chatService.saveChat(userInfo, data);
        this.server.to(chatInfo.roomId).emit('chat', chatInfo);
    }
    
}
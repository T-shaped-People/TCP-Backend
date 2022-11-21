import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { WSAuthUtil } from 'src/auth/WS-auth.util';
import { ChatController } from 'src/chat/chat.controller';
import { ChatService } from 'src/chat/chat.service';
import { ChatRoomEntity } from 'src/chat/entities/chat-room.entity';
import { ChatEntity } from 'src/chat/entities/chat.entity';
import { TeamModule } from 'src/team/team.module';
import { TeamUtil } from 'src/team/team.util';
import { ChatGateway } from './chat.gateway';
import { VoiceChatGateway } from './voiceChat.gateway';

@Module({
    imports: [
        TypeOrmModule.forFeature([ChatRoomEntity, ChatEntity]),
        AuthModule,
        TeamModule
    ],
    controllers: [ChatController],
    providers: [
        ChatService,
        VoiceChatGateway,
        ChatGateway,
        WSAuthUtil,
        TeamUtil
    ]
})

export class ChatModule { }

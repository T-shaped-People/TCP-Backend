import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatController } from 'src/chat/chat.controller';
import { ChatService } from 'src/chat/chat.service';
import { ChatRoomEntity } from 'src/chat/entities/chat-room.entity';
import { ChatEntity } from 'src/chat/entities/chat.entity';
import { TeamModule } from 'src/team/team.module';
import { TeamUtil } from 'src/team/team.util';
import { ChatGateway } from './chat.gateway';

@Module({
    imports: [
        TypeOrmModule.forFeature([ChatRoomEntity, ChatEntity]),
        TeamModule
    ],
    controllers: [ChatController],
    providers: [ChatService, ChatGateway, TeamUtil]
})
export class ChatModule {}

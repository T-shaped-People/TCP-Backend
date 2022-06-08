import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatController } from 'src/chat/chat.controller';
import { ChatRoomEntity } from 'src/chat/entities/chat-room.entity';
import { ChatEntity } from 'src/chat/entities/chat.entity';
import { ChatGateway } from './chat.gateway';

@Module({
    imports: [
        TypeOrmModule.forFeature([ChatRoomEntity, ChatEntity]),
    ],
    controllers: [ChatController],
    providers: [ChatGateway]
})
export class ChatModule {}

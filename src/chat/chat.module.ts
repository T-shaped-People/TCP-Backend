import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatEntity } from './entities/chat.entity';
import { RoomEntity } from './entities/room.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatEntity, RoomEntity]),
  ],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService]
})

export class ChatModule {}

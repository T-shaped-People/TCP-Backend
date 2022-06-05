import { Module } from '@nestjs/common';
import { ChatController } from 'src/chat/chat.controller';
import { ChatGateway } from './chat.gateway';

@Module({
  controllers: [ChatController],
  providers: [ChatGateway]
})
export class ChatModule {}

import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';

@Module({
  controllers: [],
  providers: [ChatGateway]
})
export class ChatModule {}

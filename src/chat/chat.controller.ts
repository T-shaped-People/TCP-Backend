import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import JwtAuthGuard from 'src/auth/auth.guard';
import { ChatService } from 'src/chat/chat.service';
import { GetUser } from 'src/auth/getUser.decorator';
import { User } from 'src/auth/user';
import { createChatRoomDTO } from 'src/chat/dto/create-chat-room.dto';
import { SaveChatDTO } from 'src/chat/dto/save-chat.dto';

@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Post()
    createRoom(
        @GetUser() user: User,
        @Body() dto: createChatRoomDTO
    ) {
        return this.chatService.createRoom(user, dto);
    }

    @Post('message')
    saveChat(
        @GetUser() user: User,
        @Body() dto: SaveChatDTO
    ) {
        return this.chatService.saveChat(user, dto);
    }
}

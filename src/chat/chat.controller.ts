import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import JwtAuthGuard from 'src/auth/auth.guard';
import { ChatService } from 'src/chat/chat.service';
import { GetUser } from 'src/auth/getUser.decorator';
import { User } from 'src/auth/user';
import { createChatRoomDTO } from 'src/chat/dto/delete-member.dto';

@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Post()
    createTeam(
        @GetUser() user: User,
        @Body() dto: createChatRoomDTO
    ) {
        return this.chatService.createRoom(user, dto);
    }
}

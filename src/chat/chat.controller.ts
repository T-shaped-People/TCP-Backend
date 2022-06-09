import { Body, Controller, Inject, Get, Param, Post, UseGuards } from '@nestjs/common';
import JwtAuthGuard from 'src/auth/auth.guard';
import { ChatService } from 'src/chat/chat.service';
import { GetUser } from 'src/auth/getUser.decorator';
import { User } from 'src/auth/user';
import { createChatRoomDTO } from 'src/chat/dto/create-chat-room.dto';
import { SaveChatDTO } from 'src/chat/dto/save-chat.dto';
import { getChatListDTO } from 'src/chat/dto/get-chatlist.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { LoggerService } from '@nestjs/common';

@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService) {}

    @Get(':teamId/:roomId/:startChatId')
    getChatList(
        @GetUser() user: User,
        @Param() dto: getChatListDTO
    ) {
        this.logger.log('GET : 채팅 리스트 가져오기 실행');
        this.logger.log(dto);
        return this.chatService.getChatList(user, dto);
    }

    @Post()
    createRoom(
        @GetUser() user: User,
        @Body() dto: createChatRoomDTO
    ) {
        this.logger.log('POST : 채팅방 생성 실행');
        this.logger.log(dto);
        return this.chatService.createRoom(user, dto);
    }

    @Post('message')
    saveChat(
        @GetUser() user: User,
        @Body() dto: SaveChatDTO
    ) {
        this.logger.log('POST : 메세지 저장 실행');
        this.logger.log(dto);
        return this.chatService.saveChat(user, dto);
    }
}

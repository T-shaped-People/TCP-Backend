import { Body, Controller, Inject, Get, Param, Post, UseGuards } from '@nestjs/common';
import JwtAuthGuard from 'src/auth/auth.guard';
import { ChatService } from 'src/chat/chat.service';
import { GetUser } from 'src/auth/getUser.decorator';
import { User } from 'src/auth/user';
import { createChatRoomDTO } from 'src/chat/dto/request/create-chat-room.dto';
import { getChatListDTO } from 'src/chat/dto/request/get-chatlist.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { LoggerService } from '@nestjs/common';
import { getChatRoomDTO } from 'src/chat/dto/request/get-chat-room.dto';

@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
    constructor(
        private readonly chatService: ChatService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
    ) {}

    @Get('room')
    getChatRoomList(
        @GetUser() user: User
    ) {
        return this.chatService.getRoomListByUser(user);
    }

     @Get('room/:teamId')
    getChatRoomByTeam(
        @GetUser() user: User,
        @Param('teamId') teamId: string
    ) {
        return this.chatService.getRoomListByTeam(user, teamId);
    }

    @Get('room/:teamId/:roomId')
    getChatRoom(
        @GetUser() user: User,
        @Param() dto: getChatRoomDTO
    ) {
        return this.chatService.getRoom(user, dto.teamId, dto.roomId);
    }

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
}

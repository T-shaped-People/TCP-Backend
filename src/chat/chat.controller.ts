import { Controller, Inject, Post, Body} from '@nestjs/common';
import { ChatService } from './chat.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { LoggerService } from '@nestjs/common';
import { createRoomDTO } from './dto/create-room.dto';


@Controller('chat')
export class ChatController {

    constructor(private chatService: ChatService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService ) {}

    @Post('room/create')
    async Post(@Body() dto: createRoomDTO): Promise<createRoomDTO> {
        this.logger.log("생성중입니다..");
        this.chatService.createRoom(dto);
        this.logger.log(dto);
        return dto;
    }
}

import { Injectable } from '@nestjs/common';
import { ChatEntity } from './entities/chat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomEntity } from './entities/room.entity';
import { createRoomDTO } from './dto/create-room.dto';

type ChatMessage = {
    content: string,
    date: Date
}

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(ChatEntity) private chatRepository: Repository<ChatEntity>,
        @InjectRepository(RoomEntity) private roomRepository: Repository<RoomEntity>
    ) {}
    
    async createChat(data: ChatMessage):Promise<void> {
        const chat = new ChatEntity;
        chat.content = data.content;
        chat.date = data.date;
        await this.chatRepository.save(chat);
    }

    async deleteChat(data: ChatMessage): Promise<void> {
        
    }

    async createRoom(dto: createRoomDTO): Promise<void> {
        const room = new RoomEntity;
        room.teamid = dto.teamid;
        room.create = dto.create;
        room.name = dto.name;
        await this.roomRepository.save(room);
    }
}

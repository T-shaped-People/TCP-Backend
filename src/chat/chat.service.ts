import { BadRequestException, ConflictException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { User } from 'src/auth/user';
import { plainToClass } from '@nestjs/class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatEntity } from 'src/chat/entities/chat.entity';
import { ChatRoomEntity } from 'src/chat/entities/chat-room.entity';
import { TeamUtil } from 'src/team/team.util';
import { Team } from 'src/team/team';

import { v4 as getUUID } from 'uuid';
import { createChatRoomDTO } from 'src/chat/dto/create-chat-room.dto';
import { SaveChatDTO } from 'src/chat/dto/save-chat.dto';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(ChatEntity) private chatRepository: Repository<ChatEntity>,
        @InjectRepository(ChatRoomEntity) private chatRoomRepository: Repository<ChatRoomEntity>,
        private teamUtil: TeamUtil
    ) {}

    async createRoom(user: User, dto: createChatRoomDTO) {
        const { teamId, roomTitle } = dto;

        const { team: teamInfo, member: memberInfo } = await this.teamUtil.getTeamAndMember(teamId, user.usercode);
        if (teamInfo === null) throw new NotFoundException('Team not found');
        if (memberInfo === null) throw new NotFoundException('Not joined team');
        if (memberInfo.usercode != user.usercode && teamInfo.leader != user.usercode) throw new ForbiddenException('You do not have permission for this team');

        const roomInfo = await this.chatRoomRepository.findOne({where:{title: roomTitle}});
        if (roomInfo) throw new ConflictException('Chat room title already exists');
        
        const newRoomId = getUUID().replaceAll('-', '');
        const newRoom: ChatRoomEntity = plainToClass(ChatRoomEntity, {
            id: Buffer.from(newRoomId, 'hex'),
            teamFK: Buffer.from(teamId, 'hex'),
            title: roomTitle,
            date: new Date
        });
        
        await this.chatRoomRepository.save(newRoom);
        return {
            roomId: newRoomId
        }
    }

    async saveChat(user: User, dto: SaveChatDTO) {
        const { teamId, roomId, content } = dto;
        const { team: teamInfo, member: memberInfo } = await this.teamUtil.getTeamAndMember(teamId, user.usercode);
        
        if (teamInfo === null) throw new NotFoundException('Team not found');
        if (memberInfo === null) throw new NotFoundException('Not joined team');
        const roomInfo = await this.chatRoomRepository.findOne({where: {id: Buffer.from(roomId, 'hex')}});
        if (!roomInfo || roomInfo.teamId.toString('hex') != teamId) throw new NotFoundException('Chat room not found');
        
        const newChat: ChatEntity = plainToClass(ChatEntity, {
            roomFK: Buffer.from(roomId, 'hex'),
            userFK: user.usercode,
            date: new Date,
            content
        });
        
        await this.chatRepository.save(newChat);
    }
}

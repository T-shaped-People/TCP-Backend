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
import { createChatRoomDTO } from 'src/chat/dto/delete-member.dto';

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
}

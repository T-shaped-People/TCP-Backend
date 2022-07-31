import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/auth/user';
import { plainToClass } from '@nestjs/class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'
import { ChatEntity } from 'src/chat/entities/chat.entity';
import { ChatRoomEntity } from 'src/chat/entities/chat-room.entity';
import { TeamUtil } from 'src/team/team.util';
import { Team } from 'src/team/team';

import { v4 as getUUID } from 'uuid';
import { createChatRoomDTO } from 'src/chat/dto/create-chat-room.dto';
import { SaveChatDTO } from 'src/chat/dto/save-chat.dto';
import { getChatListDTO } from 'src/chat/dto/get-chatlist.dto';
import { Chat } from 'src/chat/chat';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(ChatEntity) private chatRepository: Repository<ChatEntity>,
        @InjectRepository(ChatRoomEntity) private chatRoomRepository: Repository<ChatRoomEntity>,
        private teamUtil: TeamUtil
    ) {}

    async getChatList(user: User, dto: getChatListDTO) {
        const { teamId, roomId, startChatId } = dto;
        const { team: teamInfo, member: memberInfo } = await this.teamUtil.getTeamAndMember(teamId, user.usercode);
        if (teamInfo === null) throw new NotFoundException('Team not found');
        if (memberInfo === null) throw new NotFoundException('Not joined team');

        const roomInfo = await this.chatRoomRepository.findOne({
            where: {
                id: roomId
            }
        });
        if (!roomInfo || roomInfo.teamId !== teamId) throw new NotFoundException('Chat room not found');
        
        const chatList: ChatEntity[] = await this.chatRepository.find({
            relations: {
                user: true
            },
            select: {
                user: {
                    nickname: true
                }
            },
            where: {
                roomId
            },
            take: 15,
            skip: startChatId !== 0? startChatId: null
        })

        return chatList.map(chat => (plainToClass(Chat, chat, {excludeExtraneousValues: true})));
    }

    async createRoom(user: User, dto: createChatRoomDTO) {
        const { teamId, roomTitle } = dto;
        const { team: teamInfo, member: memberInfo } = await this.teamUtil.getTeamAndMember(teamId, user.usercode);
        if (teamInfo === null) throw new NotFoundException('Team not found');
        if (memberInfo === null) throw new NotFoundException('Not joined team');
        if (memberInfo.usercode !== user.usercode && teamInfo.leaderId !== user.usercode) throw new ForbiddenException('You do not have permission for this team');

        const roomInfo = await this.chatRoomRepository.findOne({where:{title: roomTitle}});
        if (roomInfo) throw new ConflictException('Chat room title already exists');
        
        const newRoomId = getUUID().replaceAll('-', '');
        const newRoom: ChatRoomEntity = plainToClass(ChatRoomEntity, {
            id: newRoomId,
            teamId: teamId,
            title: roomTitle
        });
        
        await this.chatRoomRepository.save(newRoom);
        return {
            roomId: newRoomId
        }
    }

    async saveChat(user: User, dto: SaveChatDTO): Promise<Chat> {
        const { teamId, roomId, content } = dto;

        const { team: teamInfo, member: memberInfo } = await this.teamUtil.getTeamAndMember(teamId, user.usercode);
        if (teamInfo === null) throw new NotFoundException('Team not found');
        if (memberInfo === null) throw new NotFoundException('Not joined team');

        const roomInfo = await this.chatRoomRepository.findOne({
            where: {
                id: roomId
            }
        });
        if (!roomInfo || roomInfo.teamId !== teamId) throw new NotFoundException('Chat room not found');
        
        const newChat = await this.chatRepository.save(
            plainToClass(ChatEntity, {
                roomId: roomId,
                usercode: user.usercode,
                content
            })
        );

        return {
            ...plainToClass(Chat, {
                    ...newChat,
                    ...user
                }, {
                    excludeExtraneousValues: true
                }),
            roomId: dto.roomId
        };
    }
}

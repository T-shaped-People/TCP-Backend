import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/auth/user';
import { plainToClass } from '@nestjs/class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm'
import { ChatEntity } from 'src/chat/entities/chat.entity';
import { ChatRoomEntity } from 'src/chat/entities/chat-room.entity';
import { TeamUtil } from 'src/team/team.util';
import { v4 as getUUID } from 'uuid';
import { createChatRoomDTO } from 'src/chat/dto/request/create-chat-room.dto';
import { SaveChatDTO } from 'src/chat/dto/request/save-chat.dto';
import { getChatListDTO } from 'src/chat/dto/request/get-chatlist.dto';
import { Chat } from 'src/chat/chat.model';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(ChatEntity) private chatRepository: Repository<ChatEntity>,
        @InjectRepository(ChatRoomEntity) private chatRoomRepository: Repository<ChatRoomEntity>,
        private teamUtil: TeamUtil
    ) {}

    async getRoomListByTeam(user: User, teamId: string): Promise<ChatRoomEntity[]> {
        const { team: teamInfo, member: memberInfo } = await this.teamUtil.getTeamAndMember(teamId, user.usercode);
        if (teamInfo === null) throw new NotFoundException('Team not found');
        if (memberInfo === null) throw new NotFoundException('Not joined team');
        
        return this.chatRoomRepository.find({
            where: {
                teamId
            }
        });
    }

    async getRoomListByUser(user: User): Promise<ChatRoomEntity[]> {
        return this.chatRoomRepository.createQueryBuilder('c')
            .select([
                'c.id id',
                'c.teamId teamId',
                'c.title title',
                'c.createdAt createdAt'
            ])
            .from('member', 'm')
            .where('m.usercode = :usercode', {usercode: user.usercode})
            .andWhere('m.teamId = c.teamId')
            .getRawMany<ChatRoomEntity>();
    }

    async getRoom(user: User, teamId: string, roomId: string):Promise<ChatRoomEntity> {
        const { team: teamInfo, member: memberInfo } = await this.teamUtil.getTeamAndMember(teamId, user.usercode);
        if (teamInfo === null) throw new NotFoundException('Team not found');
        if (memberInfo === null) throw new NotFoundException('Not joined team');

        const roomInfo = await this.chatRoomRepository.findOne({
            where: {
                id: roomId
            }
        });
        if (!roomInfo || roomInfo.teamId !== teamId) throw new NotFoundException('Chat room not found');
        return roomInfo;
    }

    async getChatList(user: User, dto: getChatListDTO) {
        const { teamId, roomId, startChatId } = dto;
        await this.getRoom(user, teamId, roomId);
        
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
                roomId,
                ...(startChatId === 0 ? {}: {id: LessThan(startChatId)})
            },
            take: 15,
            order: {
                id: 'DESC'
            }
        });

        return chatList.map(chat => (plainToClass(Chat, {
            ...chat,
            nickname: chat.user.nickname
        }, {excludeExtraneousValues: true})));
    }

    async createRoom(user: User, dto: createChatRoomDTO) {
        const { teamId, roomTitle } = dto;
        const { team: teamInfo, member: memberInfo } = await this.teamUtil.getTeamAndMember(teamId, user.usercode);
        if (teamInfo === null) throw new NotFoundException('Team not found');
        if (memberInfo === null) throw new NotFoundException('Not joined team');
        if (memberInfo.usercode !== user.usercode && teamInfo.leaderId !== user.usercode) {
            throw new ForbiddenException('You do not have permission for this team');
        }

        const roomInfo = await this.chatRoomRepository.findOne({where:{title: roomTitle}});
        if (roomInfo) throw new ConflictException('Chat room title already exists');
        
        const newRoomId = getUUID().replaceAll("-", "");
        const newRoom: ChatRoomEntity = plainToClass(ChatRoomEntity, {
            id: newRoomId,
            teamId: teamId,
            title: roomTitle
        });
        
        await this.chatRoomRepository.save(newRoom);
        return { roomId: newRoomId }
    }

    async saveChat(user: User, dto: SaveChatDTO): Promise<Chat> {
        const { teamId, roomId, content } = dto;
        await this.getRoom(user, teamId, roomId);
        
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

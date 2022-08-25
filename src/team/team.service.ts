import { BadRequestException, ConflictException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { User } from 'src/auth/user';
import { plainToClass } from '@nestjs/class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Not, Repository } from 'typeorm';
import { TeamEntity } from 'src/team/entities/team.entity';
import { MemberEntity } from 'src/team/entities/member.entity';
import { TeamUtil } from 'src/team/team.util';

import { v4 as getUUID } from 'uuid';
import { Team } from 'src/team/team';
import { Member } from 'src/team/member';
import { DeleteMemberDTO } from 'src/team/dto/delete-member.dto';

@Injectable()
export class TeamService {
    constructor(
        @InjectRepository(TeamEntity) private teamRepository: Repository<TeamEntity>,
        @InjectRepository(MemberEntity) private memberRepository: Repository<MemberEntity>,
        private teamUtil: TeamUtil
    ) {}
        
    async getTeam(teamId: string): Promise<Team> {
        const team = await this.teamUtil.getTeam(teamId);
        return plainToClass(Team, {
            ...team,
            leaderNickname: team.leader.nickname,
            totalMembers: team.members.length
        }, {excludeExtraneousValues: true});
    }
    
    async getTeamList(user: User): Promise<Team[]> {
        const teamList = await this.teamUtil.getTeamListByUsercode(user.usercode);
        return teamList.map(team => plainToClass(Team, {
            ...team,
            leaderNickname: team.leader.nickname,
            totalMembers: team.members.length
        }, {excludeExtraneousValues: true}));
    }
    
    async getTeamMemberList(teamId: string): Promise<Member[]> {
        const memberList = await this.teamUtil.getTeamMemberList(teamId);
        return memberList.map(member => plainToClass(Member, {
            ...member,
            nickname: member.user.nickname
        }, {excludeExtraneousValues: true}));
    }

    async createTeam(user: User, teamName: string) {
        const teamInfo = await this.teamRepository.findOne({
            where: {
                name: teamName
            }
        });
        if (teamInfo) throw new ConflictException('Team name already exists');
        
        const newTeamId = getUUID().replaceAll('-', '');
        const newTeam: TeamEntity = plainToClass(TeamEntity, {
            id: newTeamId,
            leaderId: user.usercode,
            name: teamName
        });
        const newLeader: MemberEntity = plainToClass(MemberEntity, {
            team: newTeam,
            usercode: user.usercode
        });

        await this.teamRepository.save(newTeam);
        await this.memberRepository.save(newLeader);
        return {
            teamId: newTeamId
        }
    }
    
    async joinTeam(user: User, teamId: string) {
        const { team: teamInfo, member: memberInfo } = await this.teamUtil.getTeamAndMember(teamId, user.usercode);
        if (teamInfo === null) throw new NotFoundException('Team not found');
        if (memberInfo !== null) throw new ConflictException('Already joined team');

        const newMember: MemberEntity = plainToClass(MemberEntity, {
            team: teamInfo,
            user
        });

        await this.memberRepository.save(newMember);
    }

    async deleteTeam(user: User, teamId: string) {
        const teamInfo = await this.teamUtil.getTeam(teamId);
        if (!teamInfo) throw new NotFoundException('Team not found');
        if (teamInfo.leaderId !== user.usercode) throw new ForbiddenException('You do not have permission for this team');

        const memberExist = await this.memberRepository.findOne({
            where: {
                teamId,
                usercode: Not(user.usercode)
            }
        })
        if (memberExist) throw new ConflictException('Please remove all team members');

        await this.memberRepository.delete({
            teamId,
            usercode: user.usercode
        });
        await this.teamRepository.delete({
            id: teamId
        });
    }

    async deleteMember(user: User, dto: DeleteMemberDTO) {
        const { teamId, memberCode } = dto;
        const { team: teamInfo, member: memberInfo } = await this.teamUtil.getTeamAndMember(teamId, memberCode);
        if (teamInfo === null) throw new NotFoundException('Team not found');
        if (memberInfo === null) throw new NotFoundException('Not already joined team');
        if (memberInfo.usercode !== memberCode && teamInfo.leaderId !== user.usercode) throw new ForbiddenException('You do not have permission for this team');
        if (teamInfo.leaderId === memberCode) throw new BadRequestException('Unable to delete team leader');

        await this.memberRepository.createQueryBuilder()
            .delete()
            .where('teamId = :teamId', {teamId: teamId})
            .andWhere('usercode = :memberCode', {memberCode})
            .execute();
    }
}

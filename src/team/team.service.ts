import { BadRequestException, ConflictException, ConsoleLogger, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/auth/user';
import { plainToClass } from '@nestjs/class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { TeamEntity } from 'src/team/entities/team.entity';
import { MemberEntity } from 'src/team/entities/member.entity';
import { TeamUtil } from 'src/team/team.util';

import { v4 as getUUID } from 'uuid';
import { randomBytes } from 'crypto';
import { Team } from 'src/team/team';
import { Member } from 'src/team/member';
import { DeleteMemberDTO } from 'src/team/dto/delete-member.dto';
import { TeamCodeEntity } from 'src/team/entities/team-code.entity';
import { CreateTeamDto } from 'src/team/dto/request/create-team.dto';
import { LeavingTeamDTO } from './dto/leaving-team.dto';

@Injectable()
export class TeamService {
    constructor(
        @InjectRepository(TeamEntity) private teamRepository: Repository<TeamEntity>,
        @InjectRepository(MemberEntity) private memberRepository: Repository<MemberEntity>,
        @InjectRepository(TeamCodeEntity) private teamCodeRepository: Repository<TeamCodeEntity>,
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

    async createTeam(user: User, dto: CreateTeamDto) {
        const teamInfo = await this.teamRepository.findOne({
            where: {
                name: dto.teamName
            }
        });
        if (teamInfo) throw new ConflictException('Team name already exists');
        
        const newTeamId = getUUID().replaceAll("/", "");

        const newTeam: TeamEntity = plainToClass(TeamEntity, {
            ...dto,
            name: dto.teamName,
            id: newTeamId,
            leaderId: user.usercode,
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
    
    async joinTeam(user: User, teamCode: string) {
        const teamCodeInfo = await this.teamCodeRepository.findOne({
            where: {
                code: teamCode
            }
        });
        if (teamCodeInfo === null) throw new NotFoundException("Team code not found");

        const { team: teamInfo, member: memberInfo } = await this.teamUtil.getTeamAndMember(teamCodeInfo.teamId, user.usercode);
        if (teamInfo === null) throw new NotFoundException('Team not found');
        if (memberInfo !== null) throw new ConflictException('Already joined team');

        const newMember: MemberEntity = plainToClass(MemberEntity, {
            team: teamInfo,
            user
        });

        await this.memberRepository.save(newMember);
        return {
            teamId: teamInfo.id
        };
    }

    async createTeamCode(user: User, teamId: string) {
        const teamInfo = await this.teamUtil.getTeam(teamId);
        if (teamInfo?.leaderId !== user.usercode) throw new ForbiddenException('You do not have permission for this team');

        const newCode = randomBytes(3).toString('hex');
        const newCodeEntity = plainToClass(TeamCodeEntity, {
            code: newCode,
            teamId,
            createdAt: new Date
        });

        await this.teamCodeRepository.save(newCodeEntity);

        return {
            teamCode: newCode
        }
    }

    async deleteTeam(user: User, teamId: string) {
        const teamInfo = await this.teamUtil.getTeam(teamId);
        if (teamInfo.leaderId !== user.usercode) throw new ForbiddenException('You do not have permission for this team');

        const memberExist = await this.memberRepository.findOne({
            where: {
                teamId,
                usercode: Not(user.usercode)
            }
        });
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
        if (memberCode === user.usercode) throw new BadRequestException('Unable to delete yourself');
        if (memberInfo.usercode !== memberCode && teamInfo.leaderId !== user.usercode) throw new ForbiddenException('You do not have permission for this team');
        if (teamInfo.leaderId === memberCode) throw new BadRequestException('Unable to delete team leader');

        await this.memberRepository.createQueryBuilder()
            .delete()
            .where('teamId = :teamId', {teamId: teamId})
            .andWhere('usercode = :memberCode', {memberCode})
            .execute();
    }

    async leavingTeam(user: User, dto: LeavingTeamDTO) {
        const { teamId } = dto;
        const { usercode } = user;
        const { team: teamInfo } = await this.teamUtil.getTeamAndMember(teamId, usercode);
        if (teamInfo.leaderId === usercode) throw new BadRequestException('Team leaders are not allowed to leave. You can delete team.');
        await this.memberRepository.createQueryBuilder()
            .delete()
            .where('teamId = :teamId', {teamId: teamId})
            .andWhere('usercode = :usercode', {usercode})
            .execute();
    }
}

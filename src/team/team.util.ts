import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamEntity } from 'src/team/entities/team.entity';
import { MemberEntity } from 'src/team/entities/member.entity';
import { Team } from 'src/team/team.model';
import { plainToClass } from '@nestjs/class-transformer';

@Injectable()
export class TeamUtil {
    constructor(
        @InjectRepository(TeamEntity) private teamRepository: Repository<TeamEntity>,
        @InjectRepository(MemberEntity) private memberRepository: Repository<MemberEntity>
    ) {}

    async getTeam(teamId: string) : Promise<Team> {
        const teamInfo = await this.teamRepository.findOne({
            where: {
                id: Buffer.from(teamId, 'hex')
            }
        });
        return plainToClass(Team, {
            ...teamInfo,
            id: teamInfo.id.toString('hex')
        });
    }
    
    async getTeamList(usercode: number) : Promise<Team[]> {
        const teamListInfo: TeamEntity[] = await this.memberRepository.createQueryBuilder('m')
            .select([
                't.id id',
                't.leader leader',
                't.name name',
            ])
            .leftJoin('m.teamFK', 't')
            .andWhere('m.usercode = :usercode', {usercode})
            .getRawMany()
        if (!teamListInfo) {
            return [];
        }
        return teamListInfo.map(team => plainToClass(Team, {
            ...team,
            id: team.id.toString('hex')
        }));
    }

    async getTeamAndMember(
        teamId: string,
        usercode: number
    ) : Promise<{
        team: null | Team,
        member: null | MemberEntity
    }> {
        const teamInfo = await this.teamRepository.findOne({
            where: {
                id: Buffer.from(teamId, 'hex')
            }
        });
        if (!teamInfo) {
            return {
                team: null,
                member: null
            }
        }
        const team: Team = plainToClass(Team, {
            ...teamInfo,
            id: teamInfo.id.toString('hex')
        }, {excludeExtraneousValues: true})
        const memberInfo = await this.memberRepository.createQueryBuilder('m')
            .select([
                't.id teamId',
                'm.usercode usercode'
            ])
            .leftJoin('m.teamFK', 't')
            .where('m.teamId = :teamId', {teamId: Buffer.from(teamId, 'hex')})
            .andWhere('m.usercode = :usercode', {usercode})
            .getRawOne();
        if (!memberInfo) {
            return {
                team,
                member: null
            }
        }
        return {
            team,
            member: memberInfo
        }
    }
}

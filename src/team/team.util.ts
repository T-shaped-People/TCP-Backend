import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamEntity } from 'src/team/entities/team.entity';
import { MemberEntity } from 'src/team/entities/member.entity';

@Injectable()
export class TeamUtil {
    constructor(
        @InjectRepository(TeamEntity) private teamRepository: Repository<TeamEntity>,
        @InjectRepository(MemberEntity) private memberRepository: Repository<MemberEntity>
    ) {}

    async getTeamAndMember(
        teamId: string,
        usercode: number
    ) : Promise<{
        team: null | TeamEntity,
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
                team: teamInfo,
                member: null
            }
        }
        return {
            team: teamInfo,
            member: memberInfo
        }
    }
}

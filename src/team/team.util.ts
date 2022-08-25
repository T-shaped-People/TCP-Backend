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

    // 팀 정보를 가져오는 함수
    async getTeam(teamId: string) : Promise<TeamEntity> {
        const teamInfo = await this.teamRepository.findOne({
            relations: {
                leader: true,
                members: true
            },
            where: {
                id: teamId
            }
        });
        if (!teamInfo) return null;

        return teamInfo;
    }
    
    // 해당 유저가 가입 중인 팀 리스트를 가져오는 함수
    async getTeamListByUsercode(usercode: number) : Promise<TeamEntity[]> {
        const teamInfoList: TeamEntity[] = (await this.memberRepository.find({
            relations: {
                user: true,
                team: {
                    leader: true,
                    members: true
                }
            },
            where: {
                usercode
            }
        })).map(member => member.team);
        
        if (!teamInfoList) return [];
        return teamInfoList;
    }

    // 해당 팀의 멤버 리스트를 가져오는 함수
    async getTeamMemberList(teamId: string) : Promise<MemberEntity[]> {
        const memberInfo = await this.memberRepository.find({
            relations: {
                user: true
            },
            where: {
                teamId
            }
        });
        return memberInfo;
    }

    // 유저가 해당 팀에 가입되어있는지 확인하는 함수
    // 팀과 멤버 객체가 null이면 팀 자체가 없다는 뜻
    async getTeamAndMember(
        teamId: string,
        usercode: number
    ) : Promise<{
        team: null | TeamEntity,
        member: null | MemberEntity
    }> {
        const team = await this.teamRepository.findOne({
            relations: {
                leader: true
            },
            where: {
                id: teamId
            }
        });
        if (!team) {
            return {
                team: null,
                member: null
            }
        }

        const member = await this.memberRepository.findOne({
                relations: {
                    user: true
                },
                where: {
                    teamId,
                    usercode
                }
            });
        if (!member) {
            return {
                team,
                member: null
            }
        }

        return {
            team,
            member
        }
    }
}

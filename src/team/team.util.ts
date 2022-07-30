import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamEntity } from 'src/team/entities/team.entity';
import { MemberEntity } from 'src/team/entities/member.entity';
import { Team } from 'src/team/team';
import { plainToClass } from '@nestjs/class-transformer';
import { Member } from 'src/team/member';

@Injectable()
export class TeamUtil {
    constructor(
        @InjectRepository(TeamEntity) private teamRepository: Repository<TeamEntity>,
        @InjectRepository(MemberEntity) private memberRepository: Repository<MemberEntity>
    ) {}

    // 팀 정보를 가져오는 함수
    async getTeam(teamId: string) : Promise<Team> {
        const teamInfo = await this.teamRepository.findOne({
            where: {
                id: teamId
            }
        });
        if (!teamInfo) return null;

        return plainToClass(Team, {
            ...teamInfo,
            id: teamInfo.id
        });
    }
    
    // 해당 유저가 가입 중인 팀 리스트를 가져오는 함수
    async getTeamListByUsercode(usercode: number) : Promise<Team[]> {
        const teamListInfo: TeamEntity[] = (await this.memberRepository.find({
            relations: {
                team: true
            },
            select: ['team'],
            where: {
                usercode
            }
        })).map(member => member.team);
        
        if (!teamListInfo) return [];
        return teamListInfo.map(team => plainToClass(Team, team, {excludeExtraneousValues: true}));
    }

    // 해당 팀의 멤버 리스트를 가져오는 함수
    async getTeamMemberList(teamId: string) : Promise<Member[]> {
        const memberInfo = await this.memberRepository.find({
            relations: {
                user: true
            },
            select: {
                user: {
                    usercode: true,
                    nickname: true
                }
            },
            where: {
                teamId
            }
        });
        return memberInfo.map(member => plainToClass(Member, {
            ...member.user,
            teamId
        }, ));
    }

    // 유저가 해당 팀에 가입되어있는지 확인하는 함수
    // 팀과 멤버 객체가 null이면 팀 자체가 없다는 뜻
    async getTeamAndMember(
        teamId: string,
        usercode: number
    ) : Promise<{
        team: null | Team,
        member: null | Member
    }> {
        const teamInfo = await this.teamRepository.findOne({
            where: {
                id: teamId
            }
        });
        if (!teamInfo) {
            return {
                team: null,
                member: null
            }
        }
        const team: Team = plainToClass(Team, teamInfo, {excludeExtraneousValues: true})

        const memberInfo = await this.memberRepository.findOne({
                relations: {
                    user: true
                },
                select: {
                    user: {
                        usercode: true,
                        nickname: true
                    }
                },
                where: {
                    teamId,
                    usercode
                }
            });
        if (!memberInfo) {
            return {
                team,
                member: null
            }
        }
        const member: Member = plainToClass(Member, memberInfo.user, {excludeExtraneousValues: true})

        return {
            team,
            member
        }
    }
}

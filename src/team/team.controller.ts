import { Body, Controller, Delete, Get, Param, Post, UseGuards, Inject } from '@nestjs/common';
import JwtAuthGuard from 'src/auth/auth.guard';
import { GetUser } from 'src/auth/getUser.decorator';
import { User } from 'src/auth/user';
import { DeleteMemberDTO } from 'src/team/dto/delete-member.dto';
import { TeamService } from './team.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { LoggerService } from '@nestjs/common';

@UseGuards(JwtAuthGuard)
@Controller('team')
export class TeamController {
    constructor(private readonly teamService: TeamService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService) {}

    @Get()
    getTeamList(@GetUser() user: User) {
        this.logger.log('GET : 팀 리스트 불러오기 실행');
        return this.teamService.getTeamList(user);
    }
    
    @Get(':teamId')
    getTeam(@Param('teamId') teamId: string) {
        this.logger.log('GET : 팀 불러오기 실행');
        this.logger.log(teamId);
        return this.teamService.getTeam(teamId);
    }

    @Get(':teamId/member')
    getTeamMemberList(@Param('teamId') teamId: string) {
        this.logger.log('GET : 팀 멤버 리스트 불러오기 실행');
        return this.teamService.getTeamMemberList(teamId);
    }

    @Post()
    createTeam(
        @GetUser() user: User,
        @Body('teamName') teamName: string
    ) {
        this.logger.log('POST : 팀 생성 실행');
        return this.teamService.createTeam(user, teamName);
    }

    @Post('join')
    joinTeam(
        @GetUser() user: User,
        @Body('teamCode') teamCode: string
    ) {
        this.logger.log('POST : 팀 참여 실행');
        return this.teamService.joinTeam(user, teamCode);
    }
    
    @Post('code')
    createTeamCode(
        @GetUser() user: User,
        @Body('teamId') teamId: string
    ) {
        this.logger.log('POST : 팀 코드 생성 실행');
        return this.teamService.createTeamCode(user, teamId);
    }
    
    @Delete(':teamId')
    deleteTeam(
        @GetUser() user: User,
        @Param('teamId') teamId: string 
    ) {
        this.logger.log('DEL : 팀 삭제 실행');
        return this.teamService.deleteTeam(user, teamId);
    }

    @Delete(':teamId/:memberCode')
    deleteMember(
        @GetUser() user: User,
        @Param() dto: DeleteMemberDTO
    ) {
        this.logger.log('DEL : 멤버 삭제 실행');
        this.logger.log(dto);
        return this.teamService.deleteMember(user, dto);
    }
}

import { Injectable, CanActivate, ExecutionContext, NotFoundException } from '@nestjs/common';
import { TeamUtil } from './team.util';

@Injectable()
export class TeamGuard implements CanActivate {
    constructor(
        private teamUtil: TeamUtil,
    ) {}
    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { usercode } = request.user;
        if (request.params.teamId !== undefined) {
            const { teamId } = request.params;
            await this.checkTeam(teamId, usercode);
        }
        else if (request.body.teamId !== undefined) {
            const { teamId } = request.body;
            await this.checkTeam(teamId, usercode);
        }
        return true;
    }
    private async checkTeam(teamId: string, usercode: number): Promise<void> {
        const { team: teamInfo, member: memberInfo } = await this.teamUtil.getTeamAndMember(teamId, usercode);
        if (teamInfo === null) throw new NotFoundException('Team not found');
        if (memberInfo === null) throw new NotFoundException('Not joined team');
    }
}
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
        const { teamId } = request.params ?? request.body;
        const { usercode } = request.user;
        const { team: teamInfo, member: memberInfo } = await this.teamUtil.getTeamAndMember(teamId, usercode);
        if (teamInfo === null) throw new NotFoundException('Team not found');
        if (memberInfo === null) throw new NotFoundException('Not joined team');
        return true;
  }
}

// const validateRequest = (req: any) => {
//     return req;
// }
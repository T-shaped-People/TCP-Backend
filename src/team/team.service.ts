import { BadRequestException, ConflictException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { User } from 'src/auth/user.model';
import { plainToClass } from '@nestjs/class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamEntity } from 'src/team/entities/team.entity';

import { v4 as getUUID } from 'uuid';

@Injectable()
export class TeamService {
  constructor(
      @InjectRepository(TeamEntity) private teamRepository: Repository<TeamEntity>
  ) {}

  async createTeam(user: User, teamName: string) {
    const teamInfo = await this.teamRepository.findOne({where:{name:teamName}});
    if (teamInfo) throw new ConflictException('Team name already exists');

    const newTeamId = getUUID().replaceAll('-', '');
    const newTeam: TeamEntity = plainToClass(TeamEntity, {
        id: Buffer.from(newTeamId, 'hex'),
        userFK: user.usercode,
        name: teamName
    });
    await this.teamRepository.save(newTeam);
    return {
        teamId: newTeamId
    }
  }
}

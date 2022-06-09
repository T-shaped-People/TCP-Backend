import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassTransformer } from '@nestjs/class-transformer';
import { TeamController } from 'src/team/team.controller';
import { TeamService } from 'src/team/team.service';
import { TeamEntity } from 'src/team/entities/team.entity';
import { TeamUtil } from 'src/team/team.util';
import { MemberEntity } from 'src/team/entities/member.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TeamEntity, MemberEntity]),
    ClassTransformer
  ],
  controllers: [TeamController],
  providers: [TeamService, TeamUtil],
  exports: [TeamUtil, TypeOrmModule]
})
export class TeamModule {}

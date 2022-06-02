import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassTransformer } from '@nestjs/class-transformer';
import { TeamController } from 'src/team/team.controller';
import { TeamService } from 'src/team/team.service';
import { TeamEntity } from 'src/team/entities/team.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TeamEntity]),
    ClassTransformer
  ],
  controllers: [TeamController],
  providers: [TeamService]
})
export class TeamModule {}

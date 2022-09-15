import { Module } from '@nestjs/common';
import { AlarmService } from './alarm.service';
import { AlarmController } from './alarm.controller';
import { TeamUtil } from 'src/team/team.util';
import { TeamModule } from 'src/team/team.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoEntity } from 'src/todo/entities/todo.entity';
import { ClassTransformer } from '@nestjs/class-transformer';

@Module({
  imports: [
    TypeOrmModule.forFeature([TodoEntity]),
    ClassTransformer,
    TeamModule
  ],
  providers: [AlarmService, TeamUtil],
  controllers: [AlarmController]
})
export class AlarmModule {}

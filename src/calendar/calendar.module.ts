import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import { CalendarEntity } from './entities/calendar.entity';
import { ClassTransformer } from '@nestjs/class-transformer';
import { TeamUtil } from 'src/team/team.util';
import { TeamModule } from 'src/team/team.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CalendarEntity]),
    ClassTransformer,
    TeamModule
  ],
  controllers: [CalendarController],
  providers: [
    CalendarService,
    TeamUtil
  ]
})
export class CalendarModule { }

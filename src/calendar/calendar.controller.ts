import { Controller, UseGuards, Post, Body, Get, Param, Put } from '@nestjs/common';
import JwtAuthGuard from 'src/auth/auth.guard';
import { GetUser } from 'src/auth/getUser.decorator';
import { User } from 'src/auth/user';
import { TeamGuard } from 'src/team/team.guard';
import { CalendarService } from './calendar.service';
import { UploadCalendarDTO } from './dto/request/upload-calendar.dto';
import { GetCalendarDTO } from './dto/request/view-calandar.dto';
import { CalendarEntity } from './entities/calendar.entity';

@UseGuards(TeamGuard)
@UseGuards(JwtAuthGuard)
@Controller('calendar')
export class CalendarController {
    constructor(private readonly calendarservice: CalendarService) {}

    @Get(':teamId') 
    viewCalendar(@Param() dto: GetCalendarDTO): Promise<CalendarEntity[]> {
        return this.calendarservice.viewCalendar(dto);
    }

    @Get('/upcoming/:teamId')
    viewUpcomingSchedule(@Param() dto: GetCalendarDTO): Promise<CalendarEntity[]> {
        return this.calendarservice.viewUpcomingSchedule(dto);
    }

    @Post('upload')
    uploadCalendar(
        @GetUser() user: User,
        @Body() dto: UploadCalendarDTO
    ): Promise<void> {
        return this.calendarservice.UploadCalendar(user, dto);
    }
}

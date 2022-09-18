import { Controller, UseGuards } from '@nestjs/common';
import JwtAuthGuard from 'src/auth/auth.guard';
import { GetUser } from 'src/auth/getUser.decorator';
import { User } from 'src/auth/user';
import { TeamGuard } from 'src/team/team.guard';
import { CalendarService } from './calendar.service';


@UseGuards(JwtAuthGuard)
@Controller('calendar')
export class CalendarController {
    constructor(private readonly calendarservice: CalendarService) {}

    
    // @Post('upload')
    // uploadCalendar(
    //     @GetUser() user: User,
    //     @Body() dto: UploadCalendarDTO
    // ): Promise<void> {
    //     return this.calendarservice.UploadCalendar(user, dto);
    // }
}

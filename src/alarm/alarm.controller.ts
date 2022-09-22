import { Get, Controller, UseGuards, Param } from '@nestjs/common';
import JwtAuthGuard from 'src/auth/auth.guard';
import { GetUser } from 'src/auth/getUser.decorator';
import { User } from 'src/auth/user';
import { TeamGuard } from 'src/team/team.guard';
import { AlarmService } from './alarm.service';
import { AlarmDTO } from './dto/alarm.dto';
import { ViewAlarmDTO } from './dto/request/view-alarm.dto';

@UseGuards(JwtAuthGuard)
@Controller('alarm')
export class AlarmController {
    constructor(private readonly alarmservice: AlarmService) {}
    
    @Get(':teamId')
    @UseGuards(TeamGuard)
    viewAlarm(@GetUser() user: User, @Param() dto: ViewAlarmDTO): Promise<AlarmDTO[]> {
        return this.alarmservice.ViewAlarm(user, dto);
    }
}
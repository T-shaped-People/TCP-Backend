import { Get, Controller, UseGuards, Param } from '@nestjs/common';
import JwtAuthGuard from 'src/auth/auth.guard';
import { GetUser } from 'src/auth/getUser.decorator';
import { User } from 'src/auth/user';
import { AlarmService } from './alarm.service';
import { ViewAlarmDTO } from './dto/request/view-alarm.dto';

@UseGuards(JwtAuthGuard)
@Controller('alarm')
export class AlarmController {
    constructor(private readonly alarmservice: AlarmService) {}
    
    @Get(':teamId')
    viewAlarm(@GetUser() user: User, @Param() dto: ViewAlarmDTO) {
        return this.alarmservice.ViewAlarm(user, dto);
    }
}
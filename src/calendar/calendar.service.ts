import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from '@nestjs/class-transformer';
import { User } from 'src/auth/user';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { UploadCalendarDTO } from './dto/request/upload-calendar.dto';
import { CalendarEntity } from './entities/calendar.entity';
import { GetCalendarDTO } from './dto/request/view-calandar.dto';

@Injectable()
export class CalendarService {
    
    constructor(@InjectRepository(CalendarEntity) private calendarRepository: Repository<CalendarEntity> ) { }
    
    async UploadCalendar(user: User, dto: UploadCalendarDTO): Promise<void> {
        await this.saveOrUpdateCalendar(user.usercode, dto);
    }
 
    async saveOrUpdateCalendar(usercode: number, dto: UploadCalendarDTO): Promise<void> {
        const { teamId, startDate, endDate , content } = dto;

        const Calendar: CalendarEntity = plainToClass(CalendarEntity, {
            teamId,
            startDate,
            endDate,
            usercode,
            content
        });
        // date 칼럼에 중복이 일어나면 update 아니면 insert
        await this.calendarRepository.upsert(Calendar, ['startDate', 'endDate']);
    }

    async viewCalendar(dto: GetCalendarDTO): Promise<CalendarEntity[]> {
        const { teamId } = dto;
        return await this.calendarRepository.find({where: {teamId: teamId}});
    }

    async viewUpcomingSchedule(dto: GetCalendarDTO): Promise<CalendarEntity[]> {
        const { teamId } = dto;
        // 오늘 날짜 0시 0분으로 초기화
        const initializedTodayDate = this.initTodayDate();
        return await this.calendarRepository.find({
            where: {
                teamId: teamId,
                startDate : MoreThanOrEqual(initializedTodayDate)
            },
            order: {
                startDate: "ASC"  
            }
        });
    }

    private initTodayDate(): Date {
        const todayDate = new Date;
        todayDate.setHours(0);
        todayDate.setMinutes(0);
        todayDate.setSeconds(0);
        todayDate.setMilliseconds(0);
        return todayDate;
    }
}

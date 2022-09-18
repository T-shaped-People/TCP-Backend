import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from '@nestjs/class-transformer';
import { User } from 'src/auth/user';
import { Repository } from 'typeorm';
import { UploadCalendarDTO } from './dto/request/upload-calendar.dto';
import { CalendarEntity } from './entities/calendar.entity';
import { GetCalendarDTO } from './dto/request/view-calandar.dto';

@Injectable()
export class CalendarService {
    constructor(@InjectRepository(CalendarEntity) private calendarRepository: Repository<CalendarEntity> ) { }
    
    async UploadCalendar(user: User, dto: UploadCalendarDTO) {
        await this.saveCalendar(user.usercode, dto);
    }
 
    async saveCalendar(usercode: number, dto: UploadCalendarDTO) {
        const { teamId, date, content } = dto;
        const Calendar: CalendarEntity = plainToClass(CalendarEntity, {
            teamId,
            date,
            usercode,
            content
        });
        await this.calendarRepository.save(Calendar);
    }

    async viewCalendar(dto: GetCalendarDTO) {
        const { teamId } = dto;
        return this.calendarRepository.find({where: {teamId: teamId}});
    }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user';
import { TeamUtil } from 'src/team/team.util';
import { TodoEntity } from 'src/todo/entities/todo.entity';
import { Repository } from 'typeorm';
import { AlarmDTO } from './dto/alarm.dto';
import { ViewAlarmDTO } from './dto/request/view-alarm.dto';
import { plainToClass } from '@nestjs/class-transformer';

@Injectable()
export class AlarmService {
    constructor(
        private teamUtil: TeamUtil,
        @InjectRepository(TodoEntity) private todoRepository: Repository<TodoEntity>,
    ) {}

    async ViewAlarm(user: User, dto: ViewAlarmDTO) {
        const { teamId } = dto;
        const { usercode } = user;
        const alarms: AlarmDTO[] = (await this.getAlarm(teamId, usercode))
            .map(alarm => plainToClass(AlarmDTO, {
            ...alarm,
        }, {excludeExtraneousValues: true}))
        return alarms;
    }

    private async getAlarm(teamId: string, usercode: number) {
        return this.todoRepository.find({
            relations: {
                team: true
            },
            where: {
                completed: false,
                team: {
                    id: teamId
                },
                mention: usercode
            },
            order: {
                id: 'DESC'
            }
        })
    }
}

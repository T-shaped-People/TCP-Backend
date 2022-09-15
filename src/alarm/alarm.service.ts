import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user';
import { TeamUtil } from 'src/team/team.util';
import { TodoEntity } from 'src/todo/entities/todo.entity';
import { Repository } from 'typeorm';
import { ViewAlarmDTO } from './dto/request/view-alarm.dto';

@Injectable()
export class AlarmService {
    constructor(
        private teamUtil: TeamUtil,
        @InjectRepository(TodoEntity) private todoRepository: Repository<TodoEntity>,
    ) {}

    async ViewAlarm(user: User, dto: ViewAlarmDTO) {
        const { teamId } = dto;
        const { usercode } = user;
        const { team: teamInfo, member: memberInfo } = await this.teamUtil.getTeamAndMember(teamId, usercode);
        if (teamInfo === null) throw new NotFoundException('Team not found');
        if (memberInfo === null) throw new NotFoundException('Not joined team');

        return this.todoRepository.find({
            select: {
                id: true,
                completed: true,
                usercode: true,
                createdAt: true,
                endAt: true,
                title: true,
                todo: true,
            },
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

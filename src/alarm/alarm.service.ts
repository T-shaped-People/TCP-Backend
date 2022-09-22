import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user';
import { TeamUtil } from 'src/team/team.util';
import { TodoEntity } from 'src/todo/entities/todo.entity';
import { Repository } from 'typeorm';
import { AlarmDTO } from './dto/alarm.dto';
import { ViewAlarmDTO } from './dto/request/view-alarm.dto';
import { plainToClass } from '@nestjs/class-transformer';
import { CategoryEntity } from 'src/post/entities/category.entity';
import { PostEntity } from 'src/post/entities/post.entity';

@Injectable()
export class AlarmService {
    constructor(
        private teamUtil: TeamUtil,
        @InjectRepository(TodoEntity) private todoRepository: Repository<TodoEntity>,
        @InjectRepository(CategoryEntity) private categoryRepository: Repository<CategoryEntity>,
        @InjectRepository(PostEntity) private postRepository: Repository<PostEntity>
    ) {}

    async ViewAlarm(user: User, dto: ViewAlarmDTO): Promise<AlarmDTO[]> {
        const { teamId } = dto;
        const { usercode } = user;
        const noticeAlarms: AlarmDTO[] = (await this.getAlarmNotice(teamId))
            .map(alarm => plainToClass(AlarmDTO, {
            alarmCategory: 'notice',
            ...alarm,
        }, {excludeExtraneousValues: true}));

        const mentionAlarms: AlarmDTO[] = (await this.getAlarmMention(teamId, usercode))
            .map(alarm => plainToClass(AlarmDTO, {
            alarmCategory: 'mention',
            ...alarm,
        }, {excludeExtraneousValues: true}));

        const Alarms: AlarmDTO[] = [...noticeAlarms, ...mentionAlarms];
        return Alarms;
    }

    private async getAlarmNotice(teamId: string) {

        const NoticeCategory = await this.categoryRepository.findBy({name: 'notice'});
        console.log(NoticeCategory)
        if (NoticeCategory.length === 0) {
            return [{title: '공지사항 카테고리를 찾을 수 없습니다.'}];
        }
        const CategoryId = NoticeCategory[0].id;
        
        return this.postRepository.find({
            where: {
                categoryId: CategoryId,
                teamId: teamId
            }
        });
    }

    private async getAlarmMention(teamId: string, usercode: number) {
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

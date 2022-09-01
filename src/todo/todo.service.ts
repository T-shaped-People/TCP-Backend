import { ConflictException, InternalServerErrorException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from '@nestjs/class-transformer';
import { User } from 'src/auth/user';
import { Repository } from 'typeorm';
import { UploadTodoDTO } from './dto/request/upload-todo.dto';
import { TodoDto } from './dto/todo.dto';
import { TodoEntity } from './entities/todo.entity';
import { TeamUtil } from 'src/team/team.util';
import { GetTodoDTO } from './dto/request/get-todo.dto';

@Injectable()
export class TodoService {
    constructor(
        @InjectRepository(TodoEntity) private todoRepository: Repository<TodoEntity>,
        private teamUtil: TeamUtil
    ) {}

    async GetTodo(user: User, dto: GetTodoDTO, getRange: number) {
        const { teamId } = dto;
        const { team: teamInfo, member: memberInfo } = await this.teamUtil.getTeamAndMember(teamId, user.usercode);
        if (teamInfo === null) throw new NotFoundException('Team not found');
        if (memberInfo === null) throw new NotFoundException('Not joined team');

        const todos: TodoDto[] = (await this.getTodoList(teamId, getRange))
            .map(todo => plainToClass(TodoDto, {
            ...todo,
            nickname: todo.user.nickname,
        }, {excludeExtraneousValues: true}))
        return todos;     
    }

    private async getTodoList(teamId: string, getRange: number): Promise<TodoEntity[]> {
        switch(getRange) {
            // 전체 Todo 가져오기
            case 0:
                return await this.todoRepository.find({
                    relations: {
                        user: true,
                        team: true
                    },
                    select: {
                        user: {
                            nickname: true
                        }
                    },
                    where: {
                        team: {
                            id: teamId
                        }
                    },
                    order: {
                        id: 'DESC'
                    }
                });
            // 완료된 Todo 가져오기
            case 1:
                return await this.todoRepository.find({
                    relations: {
                        user: true,
                        team: true
                    },
                    select: {
                        user: {
                            nickname: true
                        }
                    },
                    where: {
                        completed: true,
                        team: {
                            id: teamId
                        }
                    },
                    order: {
                        id: 'DESC'
                    }
                });
            // 완료되지 않은 Todo 가져오기
            case 2:
                return await this.todoRepository.find({
                    relations: {
                        user: true,
                        team: true
                    },
                    select: {
                        user: {
                            nickname: true
                        }
                    },
                    where: {
                        completed: false,
                        team: {
                            id: teamId
                        }
                    },
                    order: {
                        id: 'DESC'
                    }
                });
            default:
                throw new InternalServerErrorException("todo fetch error");
        }
    }

    async UploadTodo(user: User, dto: UploadTodoDTO) {
        const { teamId, todo } = dto;
        const { team: teamInfo, member: memberInfo } = await this.teamUtil.getTeamAndMember(teamId, user.usercode);
        if (teamInfo === null) throw new NotFoundException('Team not found');
        if (memberInfo === null) throw new NotFoundException('Not joined team');
        await this.saveTodo(user.usercode, dto);
        return todo;
    }

    private async saveTodo(
        usercode: number,
        dto: UploadTodoDTO
    ) {
        const { teamId, title, todo, endAt } = dto;
        const Todo: TodoEntity = plainToClass(TodoEntity, {
            teamId,
            title,
            todo,
            endAt,
            usercode
        });
        await this.todoRepository.save(Todo);
    }

}

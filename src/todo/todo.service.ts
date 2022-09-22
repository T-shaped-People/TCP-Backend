import { BadRequestException, ConflictException, InternalServerErrorException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from '@nestjs/class-transformer';
import { User } from 'src/auth/user';
import { Repository } from 'typeorm';
import { UploadTodoDTO } from './dto/request/upload-todo.dto';
import { TodoDto } from './dto/todo.dto';
import { TodoEntity } from './entities/todo.entity';
import { GetTodoDTO } from './dto/request/view-todo.dto';
import { MentionDTO } from './dto/request/mention.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { GetMentionedUserDTO } from './dto/request/view-mentioned-user.dto';
import { ModifyCompleteTodoDTO } from './dto/request/update-todo.dto';

@Injectable()
export class TodoService {
    constructor(
        @InjectRepository(TodoEntity) private todoRepository: Repository<TodoEntity>,
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    ) {}

    async ViewTodo(dto: GetTodoDTO, getRange: number): Promise<TodoDto[]> {
        const { teamId } = dto;
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

    async UploadTodo(user: User, dto: UploadTodoDTO): Promise<TodoEntity> {
        await this.saveTodo(user.usercode, dto);
        return await this.todoRepository.findOne({
            where: {
                usercode: user.usercode
            },
            order: {
                id: 'DESC'
            }
        });
    }
    
    private async saveTodo (usercode: number, dto: UploadTodoDTO): Promise<void> {
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

    async MentionTodo(user: User, dto: MentionDTO): Promise<number> {
        const { mentionUsercode, todoId } = dto;
        if (mentionUsercode === user.usercode) throw new BadRequestException('Can\'t mention on myself');
        const mentionUser = await this.userRepository.findOneBy({
            usercode: dto.mentionUsercode
        })
        if (mentionUser === null) throw new NotFoundException('Mention user not found');
        const mentionToUpdate = await this.todoRepository.findOneBy({
            id: todoId,
        })
        if (mentionToUpdate === null) throw new NotFoundException('Todo not found');
        mentionToUpdate.mention = dto.mentionUsercode;
        await this.todoRepository.save(mentionToUpdate)
        return dto.mentionUsercode;
    }

    async ViewMentionedUserInfo(dto: GetMentionedUserDTO): Promise<UserEntity> {
        const { id } = dto;
        const todoSubquery = await this.todoRepository.findOneBy({
            id: id,
        })
        if (todoSubquery === null) throw new NotFoundException('Todo not found');
        const mentionedUser = await this.userRepository.findOneBy({
            usercode: todoSubquery.mention
        })
        if (mentionedUser === null) throw new NotFoundException('Not found mentioned user')
        return mentionedUser;
    }

    async ModifyCompleteTodo(user: User, dto: ModifyCompleteTodoDTO): Promise<void> {
        const { todoId } = dto;
        const ModifyTodo = await this.todoRepository.findOne({
            select: {
                usercode: true
            },
            where: {
                id: todoId
            }
        });
        if (ModifyTodo.usercode !== user.usercode) throw new NotFoundException('Can\'t modify another user\'s todo');
        await this.todoRepository.update({
            id: todoId
        }, {
            completed: true
        });
    }
}

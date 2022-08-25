import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { User } from 'src/auth/user';
import { Repository } from 'typeorm';
import { UploadTodoDTO } from './dto/request/upload-todo.dto';
import { TodoDto } from './dto/todo.dto';
import { TodoEntity } from './entities/todo.entity';

@Injectable()
export class TodoService {
    constructor(
        @InjectRepository(TodoEntity) private todoRepository: Repository<TodoEntity>,
    ) {}

    async GetTodo(getRange: number) {
        const todos: TodoDto[] = (await this.getTodoList(getRange))
            .map(todo => plainToClass(TodoDto, {
            ...todo,
            nickname: todo.user.nickname,
        }, {excludeExtraneousValues: false}))
    
        return todos;     
    }

    private async getTodoList(getRange: number): Promise<TodoEntity[]> {
        // 전체 Todo 가져오기
        if (getRange === 0) {
            return await this.todoRepository.find({
                relations: ['user'],
                select: {
                    usercode: false,
                    user: {
                        nickname: true
                    }
                },
                order: {
                    id: 'DESC'
                }
            });
        }
        // 완료된 Todo 가져오기
        else if (getRange === 1) {
            return await this.todoRepository.find({
                relations: ['user'],
                select: {
                    user: {
                        nickname: true
                    }
                },
                where: {
                    completed: true,
                },
                order: {
                    id: 'DESC'
                }
            });
        }
        else {
            return await this.todoRepository.find({
                relations: ['user'],
                select: {
                    user: {
                        nickname: true
                    }
                },
                where: {
                    completed: false,
                },
                order: {
                    id: 'DESC'
                }
            });
        }
    }

    async UploadTodo(user: User, dto: UploadTodoDTO) {
        await this.saveTodo(user.usercode, dto);
    }

    private async saveTodo(
        usercode: number,
        dto: UploadTodoDTO
    ) {
        const { title, todo, endAt } = dto;
        const Todo: TodoEntity = plainToClass(TodoEntity, {
            title,
            todo,
            endAt,
            usercode
        });
        await this.todoRepository.save(Todo);
    }

}

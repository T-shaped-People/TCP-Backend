import { BadRequestException, ConflictException, InternalServerErrorException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from '@nestjs/class-transformer';
import { User } from 'src/auth/user';
import { getConnection, Repository, TreeRepositoryUtils } from 'typeorm';
import { UploadTodoDTO } from './dto/request/upload-todo.dto';
import { TodoDto } from './dto/todo.dto';
import { TodoEntity } from './entities/todo.entity';
import { TeamUtil } from 'src/team/team.util';
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
        private teamUtil: TeamUtil
    ) {}

    async ViewTodo(user: User, dto: GetTodoDTO, getRange: number) {
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

    async MentionTodo(user: User, dto: MentionDTO): Promise<number> {
        const { teamId, mentionUsercode, todoId } = dto;
        const { team: teamInfo, member: memberInfo } = await this.teamUtil.getTeamAndMember(teamId, user.usercode);
        if (teamInfo === null) throw new NotFoundException('Team not found');
        if (memberInfo === null) throw new NotFoundException('Not joined team');
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

    async ViewMentionedUserInfo(user: User, dto: GetMentionedUserDTO) {
        const { teamId, id } = dto;
        const { team: teamInfo, member: memberInfo } = await this.teamUtil.getTeamAndMember(teamId, user.usercode);
        if (teamInfo === null) throw new NotFoundException('Team not found');
        if (memberInfo === null) throw new NotFoundException('Not joined team');

        const TodoQb = await this.todoRepository
        .createQueryBuilder()
        .select("mention")
        .where("id = :id", {id: id})
        .getRawOne()

        const mentionedUser = await this.userRepository
        .createQueryBuilder()
        .select("*")
        .where("usercode = " + TodoQb.mention)
        .getRawOne()
    
        if (mentionedUser === null) throw new NotFoundException('Not found mentioned user')
        return mentionedUser;
    }

    async ModifyCompleteTodo(user: User, dto: ModifyCompleteTodoDTO) {
        const { todoId, teamId } = dto;
        const { team: teamInfo, member: memberInfo } = await this.teamUtil.getTeamAndMember(teamId, user.usercode);
        if (teamInfo === null) throw new NotFoundException('Team not found');
        if (memberInfo === null) throw new NotFoundException('Not joined team');
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

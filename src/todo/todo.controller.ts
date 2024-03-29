import { Controller, Post, UseGuards, Body, Get, Param, Put } from '@nestjs/common';
import JwtAuthGuard from 'src/auth/auth.guard';
import { GetUser } from 'src/auth/getUser.decorator';
import { User } from 'src/auth/user';
import { GetMentionedUserDTO } from './dto/request/view-mentioned-user.dto';
import { GetTodoDTO } from './dto/request/view-todo.dto';
import { MentionDTO } from './dto/request/mention.dto';
import { UploadTodoDTO } from './dto/request/upload-todo.dto';
import { TodoService } from './todo.service';
import { ModifyCompleteTodoDTO } from './dto/request/update-todo.dto';
import { TeamGuard } from 'src/team/team.guard';
import { TodoEntity } from './entities/todo.entity';
import { TodoDto } from './dto/todo.dto';
import { UserEntity } from 'src/user/entities/user.entity';

@UseGuards(TeamGuard)
@UseGuards(JwtAuthGuard)
@Controller('todo')
export class TodoController {
    constructor(private readonly todoservice: TodoService) { }

    @Post('upload')
    uploadTodo(
        @GetUser() user: User,
        @Body() dto: UploadTodoDTO
    ): Promise<TodoEntity> {
        return this.todoservice.UploadTodo(user, dto);
    }

    @Post('mention')
    mentionTodo(
        @GetUser() user: User,
        @Body() dto: MentionDTO
    ): Promise<number> {
        return this.todoservice.MentionTodo(user, dto);
    }

    @Put('modify/:teamId/:todoId')
    modifyCompleteTodo(
        @GetUser() user: User,
        @Param() dto: ModifyCompleteTodoDTO
    ): Promise<void> {
        return this.todoservice.ModifyCompleteTodo(user, dto);
    }

    @Get(':teamId')
    viewTodo(@Param() dto: GetTodoDTO): Promise<TodoDto[]> {
        return this.todoservice.ViewTodo(dto, 0);
    }

    @Get('completed/:teamId')
    viewCompletedTodo(@Param() dto: GetTodoDTO): Promise<TodoDto[]> {
        return this.todoservice.ViewTodo(dto, 1);
    }

    @Get('Incompleted/:teamId')
    viewIncompletedTodo(@Param() dto: GetTodoDTO): Promise<TodoDto[]> {
        return this.todoservice.ViewTodo(dto, 2);
    }

    @Get('mention/:teamId/:id')
    getMentionUserInfo(@Param() dto: GetMentionedUserDTO): Promise<UserEntity> {
        return this.todoservice.ViewMentionedUserInfo(dto);
    }
}
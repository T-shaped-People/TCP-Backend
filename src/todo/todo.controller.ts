import { Controller, Post, UseGuards, Body, Get, Param } from '@nestjs/common';
import JwtAuthGuard from 'src/auth/auth.guard';
import { GetUser } from 'src/auth/getUser.decorator';
import { User } from 'src/auth/user';
import { GetMentionedUserDTO } from './dto/request/get-mentioned-user.dto';
import { GetTodoDTO } from './dto/request/get-todo.dto';
import { MentionDTO } from './dto/request/mention.dto';
import { UploadTodoDTO } from './dto/request/upload-todo.dto';
import { TodoService } from './todo.service';


@UseGuards(JwtAuthGuard)
@Controller('todo')
export class TodoController {
    constructor(private readonly todoservice: TodoService) {}

    @Post('upload')
    uploadTodo(
        @GetUser() user: User,
        @Body() dto: UploadTodoDTO
    ): Promise<string> {
        return this.todoservice.UploadTodo(user, dto);
    }

    @Post('mention') 
    mentionTodo(
        @GetUser() user: User,
        @Body() dto: MentionDTO
    ) {
        return this.todoservice.MentionTodo(user, dto);
    }

    @Get(':teamId')
    getTodo(@GetUser() user: User, @Param() dto: GetTodoDTO) {
        return this.todoservice.GetTodo(user, dto, 0);
    }

    @Get('completed/:teamId')
    getCompletedTodo(@GetUser() user: User, @Param() dto: GetTodoDTO) {
        return this.todoservice.GetTodo(user, dto, 1);
    }

    @Get('Incompleted/:teamId')
    getIncompletedTodo(@GetUser() user: User, @Param() dto: GetTodoDTO) {
        return this.todoservice.GetTodo(user, dto, 2);
    }

    @Get('mention/:teamId/:id')
    getMentionUserInfo(@GetUser() user: User, @Param() dto: GetMentionedUserDTO) {
        return this.todoservice.GetMentionedUserInfo(user, dto);
    }
}
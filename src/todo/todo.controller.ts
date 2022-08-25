import { Controller, Post, UseGuards, Body, Get } from '@nestjs/common';
import JwtAuthGuard from 'src/auth/auth.guard';
import { GetUser } from 'src/auth/getUser.decorator';
import { User } from 'src/auth/user';
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
      ) {
        return this.todoservice.UploadTodo(user, dto);
    }

    @Get()
    getTodo() {
        return this.todoservice.GetTodo();
    }
}

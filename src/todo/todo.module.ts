import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassTransformer } from '@nestjs/class-transformer';
import { TodoEntity } from './entities/todo.entity';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([TodoEntity]),
        ClassTransformer
    ],
  controllers: [TodoController],
  providers: [TodoService]
})
export class TodoModule {}

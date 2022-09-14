import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassTransformer } from '@nestjs/class-transformer';
import { TodoEntity } from './entities/todo.entity';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { TeamUtil } from 'src/team/team.util';
import { TeamModule } from 'src/team/team.module';
import { UserEntity } from 'src/user/entities/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([TodoEntity, UserEntity]),
        ClassTransformer,
        TeamModule
    ],
  controllers: [TodoController],
  providers: [TodoService, 
              TeamUtil]
})
export class TodoModule {}

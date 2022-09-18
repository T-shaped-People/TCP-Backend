import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { PostModule } from 'src/post/post.module';
import { CommentModule } from 'src/comment/comment.module';
import { TeamModule } from 'src/team/team.module';
import { UserModule } from './user/user.module';
import { DrawingModule } from './drawing/drawing.module';
import { ChatModule } from './chat/chat.module';
import { TodoModule } from './todo/todo.module';
import { AlarmModule } from './alarm/alarm.module';
import { CalendarModule } from './calendar/calendar.module';

import * as winston from 'winston';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PW,
      database: process.env.DB_NAME,
      synchronize: true,
      logging: true,
      entities: [__dirname + '/**/entities/*.entity.{js,ts}']
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          level: process.env.NODE_ENV === 'production' ?
          'info' : 'silly',
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike('TCP-api-logger', {
              prettyPrint: true
            }),
          ),
        }),
      ],
    }),
    AuthModule,
    UserModule,
    PostModule,
    CommentModule,
    TeamModule,
    DrawingModule,
    ChatModule,
    TodoModule,
    AlarmModule,
    CalendarModule],
  controllers: [],
})
export class AppModule {}

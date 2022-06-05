import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from 'src/auth/auth.module';
import { BoardModule } from 'src/board/board.module';
import { TeamModule } from 'src/team/team.module';
import { UserModule } from './user/user.module';
import { DrawingModule } from './drawing/drawing.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DB_HOST,
      username: process.env.DB_USER,
      password: process.env.DB_PW,
      database: process.env.DB_NAME,
      synchronize: true,
      logging: true,
      entities: [__dirname + '/**/entities/*.entity.{js,ts}']
    }),
    AuthModule,
    UserModule,
    BoardModule,
    TeamModule,
    DrawingModule,
    ChatModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from 'src/auth/auth.module';
import { BoardModule } from 'src/board/board.module';
import { TeamModule } from 'src/team/team.module';
import { UserModule } from './user/user.module';
import { DrawingController } from './drawing/drawing.controller';
import { DrawingModule } from './drawing/drawing.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mariadb',
      // port: 3306,
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
    DrawingModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

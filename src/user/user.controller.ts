import { Controller, Get, Res, UseGuards, Inject, Query } from '@nestjs/common';
import { Response } from 'express';
import JwtAuthGuard from 'src/auth/auth.guard';
import { GetUser } from 'src/auth/getUser.decorator';
import { User } from 'src/auth/user';
import { UserService } from './user.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { LoggerService } from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, 
                @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService) {}

  @Get('oauth/bsm')
  oauth(
    @Res({passthrough: true}) res: Response,
    @Query('code') authCode: string
  ) {
    this.logger.log('POST : 로그인 시작')
    this.logger.log(`authCode: ${authCode}`);
    return this.userService.oauth(res, authCode);
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)  
  getUserInfo(@GetUser() user: User) {
    this.logger.log('GET : 유저 리스트 가져오기 실행');
    return {
      ...user
    };
  }
}

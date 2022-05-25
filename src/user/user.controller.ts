import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import JwtAuthGuard from 'src/auth/auth.guard';
import { GetUser } from 'src/auth/getUser.decorator';
import { User } from 'src/auth/user.model';
import { CreateUserOAuthDTO } from 'src/user/dto/create-user-oauth.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('oauth/bsm')
  BSMOAuth(
    @Res({passthrough: true}) res: Response,
    @Body() dto: CreateUserOAuthDTO
  ) {
    return this.userService.BSMOAuth(res, dto);
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  a(@GetUser() user: User) {
    return {
      user
    };
  }
}

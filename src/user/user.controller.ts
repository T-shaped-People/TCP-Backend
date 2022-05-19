import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserOAuthDTO } from 'src/user/dto/create-user-oauth.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('oauth')
  createUserWithOAuth(@Body() dto: CreateUserOAuthDTO) {
    return this.userService.createUserWithOAuth(dto);
  }
}

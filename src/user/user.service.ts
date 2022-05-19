import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserOAuthDTO } from 'src/user/dto/create-user-oauth.dto';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { BSMOAuthCodeDTO } from 'src/user/dto/bsm-code-dto';
const { CLIENT_ID, CLIENT_SECRET } = process.env;

@Injectable()
export class UserService {
  constructor(
    private httpService: HttpService
  ) {}
  
  private readonly getTokenURL = 'https://bssm.kro.kr/api/oauth/token';

  async createUserWithOAuth(dto: CreateUserOAuthDTO) {
    const { authcode } = dto;
    const request = {
      authcode,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
    };
    
    const req = await lastValueFrom(this.httpService.post(this.getTokenURL, (request)));
    if (!(BSMOAuthCodeDTO instanceof req.data)) {
      throw new BadRequestException('Authcode not found');
    }
    console.log(req.data.token);
  }
}

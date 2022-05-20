import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserOAuthDTO } from 'src/user/dto/create-user-oauth.dto';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { BSMOAuthCodeDTO } from 'src/user/dto/bsm-code-dto';
const { CLIENT_ID, CLIENT_SECRET } = process.env;
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { plainToClass } from '@nestjs/class-transformer';
import { BSMOAuthResourceDTO } from 'src/user/dto/bsm-resource.dto';

@Injectable()
export class UserService {
  constructor(
    private httpService: HttpService,
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>
  ) {}
  
  private readonly getOAuthTokenURL = 'https://bssm.kro.kr/api/oauth/token';
  private readonly getOAuthResourceURL = 'https://bssm.kro.kr/api/oauth/resource';

  async createUserWithOAuth(dto: CreateUserOAuthDTO) {
    const { authcode } = dto;

    const getTokenPayload = {
      authcode,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET
    };
    let tokenData: BSMOAuthCodeDTO;
    try {
      tokenData = plainToClass(BSMOAuthCodeDTO, (await lastValueFrom(this.httpService.post(this.getOAuthTokenURL, (getTokenPayload)))).data);
    } catch (err) {
      if (err.statusCode == 400) {
        throw new BadRequestException('Authcode not found');
      }
      console.log(err);
      throw new InternalServerErrorException('OAuth Failed');
    }
    if (!tokenData.token) {
      throw new BadRequestException('Authcode not found');
    }
    
    const getResourcePayload = {
      token: tokenData.token,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET
    };
    let resourceData: BSMOAuthResourceDTO;
    try {
      resourceData = plainToClass(BSMOAuthResourceDTO, (await lastValueFrom(this.httpService.post(this.getOAuthResourceURL, (getResourcePayload)))).data.user);
    } catch (err) {
      if (err.statusCode == 400) {
        throw new BadRequestException('User not found');
      }
      console.log(err);
      throw new InternalServerErrorException('OAuth Failed');
    }
    if (!resourceData.code) {
      throw new BadRequestException('User not found');
    }

    this.saveUser(resourceData);
  }

  private async saveUser(
    dto: BSMOAuthResourceDTO
  ) {
    const user = new UserEntity();
    user.usercode = dto.code;
    user.nickname = dto.nickname;
    user.enrolled = dto.enrolled;
    user.grade = dto.grade;
    user.classNo = dto.classNo;
    user.studentNo = dto.studentNo;
    user.name = dto.name;
    user.email = dto.email;
    await this.userRepository.save(user);
  }
}

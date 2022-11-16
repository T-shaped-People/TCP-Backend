import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto'

import { UserSignUpRequest } from 'src/user/dto/request/userSignUpRequest';
import { TokenEntity } from 'src/auth/entities/token.entity';
import { User } from 'src/auth/user';
import BsmOauth, { BsmOauthError, BsmOauthErrorType, BsmOauthUserRole, StudentResource, TeacherResource } from 'bsm-oauth';

const { BSM_OAUTH_CLIENT_ID, BSM_OAUTH_CLIENT_SECRET, SECRET_KEY } = process.env;

@Injectable()
export class UserService {
    constructor(
        private jwtService: JwtService,
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        @InjectRepository(TokenEntity) private tokenRepository: Repository<TokenEntity>
    ) {
        this.bsmOauth = new BsmOauth(BSM_OAUTH_CLIENT_ID, BSM_OAUTH_CLIENT_SECRET);
    }
  
    private bsmOauth: BsmOauth;

    async oauth(
        res: Response,
        authCode: string
    ) {

        let resource: StudentResource | TeacherResource;
        try {
            resource = await this.bsmOauth.getResource(
                await this.bsmOauth.getToken(authCode)
            );
        } catch (error) {
            if (error instanceof BsmOauthError) {
                switch (error.type) {
                    case BsmOauthErrorType.INVALID_CLIENT: {
                        throw new InternalServerErrorException('OAuth Failed');
                    }
                    case BsmOauthErrorType.AUTH_CODE_NOT_FOUND: {
                        throw new NotFoundException('Authcode not found');
                    }
                    case BsmOauthErrorType.TOKEN_NOT_FOUND: {
                        throw new NotFoundException('Token not found');
                    }
                }
            }
            throw new InternalServerErrorException('OAuth Failed');
        }
        
        let userInfo = await this.getUserBycode(resource.userCode);
        if (!userInfo) {
            await this.saveUser({
                code: resource.userCode,
                nickname: resource.nickname,
                name: resource.role === BsmOauthUserRole.STUDENT? resource.student.name: resource.teacher.name
            });
            userInfo = await this.getUserBycode(resource.userCode);
            if (!userInfo) {
                throw new NotFoundException('User not Found');
            }
        }
        await this.login(res, userInfo);
        res.redirect('http://localhost:3000/calendar');
    }

    private async login(
        res: Response,
        user: User
    ) {
        const token = this.jwtService.sign({...user}, {
            secret: SECRET_KEY,
            algorithm: 'HS256',
            expiresIn: '1h'
        });
        const refreshToken = this.jwtService.sign({
            refreshToken: (await this.createToken(user.usercode)).token
        }, {
            secret: SECRET_KEY,
            algorithm: 'HS256',
            expiresIn: '60d'
        });
        
        res.cookie('token', token, {
            path: '/',
            httpOnly: true,
            maxAge: 1000*60*60
        });
        res.cookie('refreshToken', refreshToken, {
            path: '/',
            httpOnly: true,
            maxAge: 24*60*1000*60*60
        });
        return {
            token,
            refreshToken: refreshToken
        }
    }

    private async saveUser(request: UserSignUpRequest) {
        const user = new UserEntity();
        user.usercode = request.code;
        user.nickname = request.nickname;
        user.name = request.name;
        await this.userRepository.save(user);
    }

    private async getUserBycode(usercode: number): Promise<UserEntity | undefined> {
        return this.userRepository.findOne({
            where: {
                usercode
            }
        })
    }

    private async createToken(usercode: number): Promise<TokenEntity> {
        const refreshToken = new TokenEntity();
        refreshToken.token = randomBytes(64).toString('hex');
        refreshToken.usercode = usercode;
        refreshToken.valid = true;
        refreshToken.createdAt = new Date;

        await this.tokenRepository.save(refreshToken);
        return refreshToken;
    }
}

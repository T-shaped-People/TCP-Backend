import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from './user.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => {
                    return req?.cookies?.token;
                }
            ]),
            secretOrKey: process.env.SECRET_KEY,
            passReqToCallback: true,
        })
    }

    async validate(req: Request, user: User) {
        if (user.usercode) {
            return user;
        } else {
            throw new UnauthorizedException();
        }
    }
}
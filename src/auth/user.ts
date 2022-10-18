import { Expose } from "@nestjs/class-transformer";
import { IsNumber, IsString } from "class-validator"

export class User {
    
    @IsNumber()
    @Expose()
    usercode: number;

    @IsString()
    @Expose()
    nickname: string;

    @IsString()
    @Expose()
    name: string;

}
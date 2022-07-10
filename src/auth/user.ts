import { Expose } from "@nestjs/class-transformer";
import { IsNumber, IsString } from "class-validator"

export class User {
    @IsNumber()
    @Expose()
    usercode: number;

    @IsString()
    @Expose()
    nickname: string;

    @IsNumber()
    @Expose()
    enrolled: number;

    @IsNumber()
    @Expose()
    grade: number;

    @IsNumber()
    @Expose()
    classNo: number;

    @IsNumber()
    @Expose()
    studentNo: number;

    @IsString()
    @Expose()
    name: string;

    @IsString()
    @Expose()
    email: string;
}
import { IsNumber, IsString } from "class-validator"

export class User {
    @IsNumber()
    usercode: number;

    @IsString()
    nickname: string;

    @IsNumber()
    enrolled: number;

    @IsNumber()
    grade: number;

    @IsNumber()
    classNo: number;

    @IsNumber()
    studentNo: number;

    @IsString()
    name: string;

    @IsString()
    email: string;
}
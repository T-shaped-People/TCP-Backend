import { IsNumber, IsString } from "class-validator";

export class BSMOAuthResourceDTO {
    @IsNumber()
    readonly code: number;

    @IsString()
    readonly nickname: string;

    @IsNumber()
    readonly enrolled: number;

    @IsNumber()
    readonly grade: number;

    @IsNumber()
    readonly classNo: number;

    @IsNumber()
    readonly studentNo: number;

    @IsString()
    readonly name: string;

    @IsString()
    readonly email: string;
}
import { IsDate, IsString } from "class-validator";

export class UploadTodoDTO {

    @IsString()
    teamId: string;
    
    @IsString()
    title: string;

    @IsString()
    todo: string;

    @IsDate()
    endAt: Date;

}
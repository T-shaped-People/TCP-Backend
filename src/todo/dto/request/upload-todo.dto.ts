import { IsDate, IsString } from "class-validator";

export class UploadTodoDTO {
    
    @IsString()
    title: string;

    @IsString()
    todo: string;

    // @Expose
    // TODO :: 담당자 추가

    @IsDate()
    endAt: Date;
}
import { IsDate, IsString } from "class-validator";

export class UploadCalendarDTO {

    @IsString()
    teamId: string;

    @IsDate()
    date: Date;

    @IsString()
    content: string;
}
import { IsString } from "class-validator";
import { IsOnlyDate } from "src/calendar/isOnlyDate.decorator";

export class UploadCalendarDTO {

    @IsString()
    teamId: string;

    @IsOnlyDate()
    date: string;

    @IsString()
    content: string;
}
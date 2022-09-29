import { IsNumber, IsString } from "class-validator";
import { IsOnlyDate } from "src/calendar/isOnlyDate.decorator";

export class UpdateCalendarDTO {

    @IsNumber()
    id: number;

    @IsOnlyDate()
    startDate: string;

    @IsOnlyDate()
    endDate: string;

    @IsString()
    content: string;
}
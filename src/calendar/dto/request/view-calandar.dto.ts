import { IsString } from "class-validator";

export class GetCalendarDTO {
    @IsString()
    teamId: string;
}
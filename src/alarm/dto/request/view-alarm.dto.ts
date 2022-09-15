import { IsString } from "class-validator";

export class ViewAlarmDTO {
    @IsString()
    teamId: string;
}
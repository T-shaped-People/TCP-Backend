import { IsDate, IsString } from "class-validator";

export class CreateTeamDto {

    @IsString()
    teamName: string;

    @IsString()
    description: string;

    @IsDate()
    startDate: Date;

    @IsDate()
    deadline: Date;
}
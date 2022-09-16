import { IsDate, IsString, IsNotEmpty } from "class-validator";

export class CreateTeamDto {

    @IsString()
    @IsNotEmpty()
    teamName: string;

    @IsString()
    description: string;

    @IsDate()
    startDate: Date;

    @IsDate()
    deadline: Date;
}
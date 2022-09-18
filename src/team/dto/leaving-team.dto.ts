import { IsString } from "class-validator";

export class LeavingTeamDTO {
    @IsString()
    teamId: string;
}
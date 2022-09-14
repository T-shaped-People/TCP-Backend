import { IsNumber, IsString } from "class-validator";

export class MentionDTO {
    @IsNumber()
    id: number;

    @IsString()
    teamId: string;

    @IsNumber()
    usercode: number;
}
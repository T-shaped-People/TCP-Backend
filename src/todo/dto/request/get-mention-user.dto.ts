import { IsNumber, IsString } from "class-validator";

export class GetMentionUserDTO {
    @IsString()
    teamId: string;

    @IsNumber()
    id: number;
}
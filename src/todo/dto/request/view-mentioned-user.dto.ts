import { IsNumber, IsString } from "class-validator";

export class GetMentionedUserDTO {
    @IsString()
    teamId: string;

    @IsNumber()
    id: number;
}
import { IsNumber, IsString } from "class-validator";

export class MentionDTO {
    @IsNumber()
    todoId: number;

    @IsString()
    teamId: string;

    @IsNumber()
    mentionUsercode: number;
}
import { IsNumber, IsString } from "class-validator";

export class deleteChatDTO {
    @IsString()
    teamId: string;

    @IsNumber()
    chatId: number;
}
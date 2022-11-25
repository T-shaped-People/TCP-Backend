import { IsString } from "class-validator";

export class deleteChatDTO {
    @IsString()
    teamId: string;

    @IsString()
    chatId: number;
}
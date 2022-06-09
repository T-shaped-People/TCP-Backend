import { IsNotEmpty, IsString } from "class-validator";

export class SaveChatDTO {
    @IsString()
    teamId: string;

    @IsString()
    roomId: string;
    
    @IsString()
    @IsNotEmpty()
    content: string;
}
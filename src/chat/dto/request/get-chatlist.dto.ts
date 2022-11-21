import { IsNumber, IsOptional, IsString, Min } from "class-validator";

export class getChatListDTO {
    @IsString()
    teamId: string;

    @IsString()
    roomId: string;
    
    @IsOptional()
    @IsNumber()
    @Min(0)
    startChatId: number = 0;
}
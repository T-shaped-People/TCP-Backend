import { IsNumber, IsOptional, IsString, Min } from "class-validator";

export class getChatRoomDTO {
    @IsString()
    teamId: string;

    @IsString()
    roomId: string;
}
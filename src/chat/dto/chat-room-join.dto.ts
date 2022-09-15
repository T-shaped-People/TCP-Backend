import { IsString } from "class-validator";

export class ChatRoomJoinDto {
    @IsString()
    teamId: string;

    @IsString()
    roomId: string;
}
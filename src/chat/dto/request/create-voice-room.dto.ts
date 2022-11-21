import { IsNotEmpty, IsString } from "class-validator";
import { createChatRoomDTO } from "./create-chat-room.dto";

export class createVoiceRoomDTO {
    @IsString()
    teamId: string;

    @IsString()
    @IsNotEmpty()
    roomTitle: string;
}
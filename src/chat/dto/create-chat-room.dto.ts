import { IsNotEmpty, IsString } from "class-validator";

export class createChatRoomDTO {
    @IsString()
    teamId: string;

    @IsString()
    @IsNotEmpty()
    roomTitle: string;
}
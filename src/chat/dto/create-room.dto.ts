import { IsDate, IsNumber, IsString } from "class-validator";

export class createRoomDTO {
    @IsNumber()
    readonly teamid: number;

    @IsDate()
    readonly create: Date;

    @IsString()
    readonly name: string;
}
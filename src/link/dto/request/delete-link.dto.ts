import { IsNumber, IsString } from "class-validator";

export class DeleteLinkDTO {

    @IsString()
    teamId: string;

    @IsNumber()
    id: number;
}
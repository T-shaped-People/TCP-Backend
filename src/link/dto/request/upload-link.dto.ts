import { IsString, Length, max, min } from "class-validator";

export class UploadLinkDTO {

    @IsString()
    teamId: string;

    @IsString()
    @Length(2, 16)
    title: string;
    
    @IsString()
    @Length(1, 255)
    link: string;
}
import { IsString } from "class-validator";

export class GetLinkListDTO {
    
    @IsString()
    teamId: string;
}
import { IsString } from "class-validator";

export class WritePostDTO {
    @IsString()
    category: string;

    @IsString()
    title: string;
    
    @IsString()
    content: string;
}
import { IsNotEmpty, IsString } from "class-validator";

export class WritePostDTO {
    @IsString()
    category: string;

    @IsString()
    title: string;
    
    @IsString()
    @IsNotEmpty()
    content: string;
}
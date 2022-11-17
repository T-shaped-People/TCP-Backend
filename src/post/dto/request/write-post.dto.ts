import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class WritePostDTO {
    @IsString()
    category: string;

    @IsString()
    title: string;
    
    @IsString()
    @IsNotEmpty()
    content: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    teamId?: string;
}
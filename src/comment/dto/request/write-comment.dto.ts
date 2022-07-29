import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class WriteCommentDTO {
    @IsNumber()
    @Min(0)
    depth: number;

    @IsNumber()
    parentId: number | null;
    
    @IsString()
    @IsNotEmpty()
    content: string;
}
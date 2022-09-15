import { IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class postListDTO {
    @IsOptional()
    @IsNumber()
    @Min(1)
    page: number = 1;

    @IsOptional()
    @IsNumber()
    @Min(5)
    limit: number = 15;
    
    @IsOptional()
    @IsString()
    category: string = 'all';
    
    @IsOptional()
    @IsString()
    teamId: string;
}
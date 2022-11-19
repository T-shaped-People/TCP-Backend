import { Expose } from "@nestjs/class-transformer";

export class PostDto {
    
    @Expose()
    id: number;

    @Expose()
    usercode: number;

    @Expose()
    nickname: string;
    
    @Expose()
    category: string;
    
    @Expose()
    createdAt: Date;
    
    @Expose()
    hit: number;
    
    @Expose()
    commentCnt: number;
    
    @Expose()
    title: string;

    @Expose()
    description: string;

    @Expose()
    field: string;

    @Expose()
    teamColor: string;
}
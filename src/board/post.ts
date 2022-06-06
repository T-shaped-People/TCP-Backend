import { Expose } from "@nestjs/class-transformer";

export class Post {
    @Expose()
    id: number;

    @Expose()
    usercode: number;

    @Expose()
    nickname: string;
    
    @Expose()
    category: string;
    
    @Expose()
    created: Date;
    
    @Expose()
    hit: number;
    
    @Expose()
    commentCnt: number;
    
    @Expose()
    title: string;
}
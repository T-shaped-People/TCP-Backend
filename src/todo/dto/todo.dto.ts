import { Expose } from "@nestjs/class-transformer";

export class TodoDto {
    
    @Expose()
    id: number;

    @Expose()
    completed: boolean;

    @Expose()
    nickname: string;

    @Expose()
    createdAt: Date;

    @Expose()
    endAt: Date;
    
    @Expose()
    title: string;
    
    @Expose()
    todo: string;

}
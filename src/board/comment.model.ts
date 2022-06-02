import { Expose } from "@nestjs/class-transformer";

export class Comment {
    @Expose()
    id: number;

    @Expose()
    deleted: boolean;

    @Expose()
    usercode: number;

    @Expose()
    nickname: string;

    @Expose()
    depth: number;

    @Expose()
    created: Date;

    @Expose()
    content: string;

    permission: boolean;

    child?: Comment[];
}
import { Expose } from "@nestjs/class-transformer";
import { DeletedComment } from "src/board/deleted-comment";

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

    child?: (Comment | DeletedComment)[];
}
import { Exclude, Expose } from "@nestjs/class-transformer";
import { Comment } from "src/board/comment";

export class DeletedComment {
    @Expose()
    id: number;

    @Exclude()
    deleted: boolean = true;

    @Expose()
    depth: number;

    @Expose()
    created: Date;

    @Exclude()
    permission: boolean = false;

    child?: (Comment | DeletedComment)[];
}
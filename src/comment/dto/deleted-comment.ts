import { Exclude, Expose } from "@nestjs/class-transformer";
import { Comment } from "src/comment/dto/comment";

export class DeletedComment {
    @Expose()
    id: number;

    @Exclude()
    deleted: boolean = true;

    @Expose()
    depth: number;

    @Exclude()
    permission: boolean = false;

    child?: (Comment | DeletedComment)[];
}
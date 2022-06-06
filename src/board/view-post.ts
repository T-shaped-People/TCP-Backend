import { Expose } from "@nestjs/class-transformer";
import { Post } from "src/board/post";

export class ViewPost extends Post {
    @Expose()
    content?: string;
    
    @Expose()
    permission?: boolean;
}
import { Expose } from "@nestjs/class-transformer";
import { PostDto } from "src/post/dto/post.dto";

export class ViewPostDto extends PostDto {

    @Expose()
    content?: string;
    
    @Expose()
    permission?: boolean;
}
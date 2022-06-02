import { IsNumber } from "class-validator";

export class DeleteCommentDTO {
    @IsNumber()
    commentId: number;

    @IsNumber()
    postId: number;
}
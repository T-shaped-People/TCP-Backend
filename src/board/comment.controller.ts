import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import JwtAuthGuard from 'src/auth/auth.guard';
import { GetUser } from 'src/auth/getUser.decorator';
import { User } from 'src/auth/user.model';
import { DeleteCommentDTO } from 'src/board/dto/delete-comment.dto';
import { WriteCommentDTO } from 'src/board/dto/write-comment.dto';
import { CommentService } from './comment.service';

@UseGuards(JwtAuthGuard)
@Controller('board/comment')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Get(':postId')
    viewComment(@GetUser() user: User, @Param('postId') postId: number) {
        return this.commentService.viewComment(user, postId);
    }

    @Post(':postId')
    writeComment(
        @GetUser() user: User,
        @Param('postId') postId: number,
        @Body() dto: WriteCommentDTO
    ) {
        return this.commentService.writeComment(user, postId, dto);
    }

    @Delete(':postId/:commentId')
    deleteComment(
        @GetUser() user: User,
        @Param() dto: DeleteCommentDTO
    ) {
        return this.commentService.deleteComment(user, dto);
    }
}

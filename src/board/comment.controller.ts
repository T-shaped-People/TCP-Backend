import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import JwtAuthGuard from 'src/auth/auth.guard';
import { GetUser } from 'src/auth/getUser.decorator';
import { User } from 'src/auth/user.model';
import { CommentService } from './comment.service';

@UseGuards(JwtAuthGuard)
@Controller('board/comment')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Get(':postId')
    viewComment(@GetUser() user: User, @Param('postId') postId: number) {
        return this.commentService.viewComment(user, postId);
    }
}

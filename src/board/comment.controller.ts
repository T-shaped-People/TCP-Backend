import { Body, Controller, Delete, Get, Param, Post, UseGuards, Inject } from '@nestjs/common';
import JwtAuthGuard from 'src/auth/auth.guard';
import { GetUser } from 'src/auth/getUser.decorator';
import { User } from 'src/auth/user';
import { DeleteCommentDTO } from 'src/board/dto/delete-comment.dto';
import { WriteCommentDTO } from 'src/board/dto/write-comment.dto';
import { CommentService } from './comment.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { LoggerService } from '@nestjs/common';

@UseGuards(JwtAuthGuard)
@Controller('board/comment')
export class CommentController {
    constructor(private readonly commentService: CommentService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService) {}

    @Get(':postId')
    viewComment(@GetUser() user: User, @Param('postId') postId: number) {
        this.logger.log('GET : 댓글 불러오기 실행');
        return this.commentService.viewComment(user, postId);
    }

    @Post(':postId')
    writeComment(
        @GetUser() user: User,
        @Param('postId') postId: number,
        @Body() dto: WriteCommentDTO
    ) {
        this.logger.log('POST : 댓글 저장 실행');
        this.logger.log(dto);
        return this.commentService.writeComment(user, postId, dto);
    }

    @Delete(':postId/:commentId')
    deleteComment(
        @GetUser() user: User,
        @Param() dto: DeleteCommentDTO
    ) {
        this.logger.log('DEL : 댓글 삭제 실행');
        this.logger.log(dto);
        return this.commentService.deleteComment(user, dto);
    }
}

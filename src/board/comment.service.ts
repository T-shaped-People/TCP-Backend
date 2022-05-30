import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { User } from 'src/auth/user.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from 'src/board/entities/post.entity';
import { CommentEntity } from 'src/board/entities/comment.entity';
import { Comment } from 'src/board/comment.model';
import { plainToClass } from '@nestjs/class-transformer';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(PostEntity)
        private postRepository: Repository<PostEntity>,
        @InjectRepository(CommentEntity)
        private commentRepository: Repository<CommentEntity>,
    ) {}

    async viewComment(user: User, postId: number) {
        const commentInfo = await this.commentRepository.find({
            where: {
                postId,
            },
        });
        return {
            comments: this.commentTree(commentInfo, 0, user.usercode)
        }
    }

    private commentTree(
        commentList: CommentEntity[],
        depth: number,
        usercode: number,
    ) {
        let result: Comment[] = [];
        commentList.forEach((e) => {
            // 대댓글의 깊이가 불러오려는 현재 깊이와 같은지 확인
            if (e.depth != depth) {
                return [];
            }
            let comment: Comment;
            comment = plainToClass(Comment, e, {excludeExtraneousValues: true});
            // 삭제된 댓글인지 확인
            if (e.deleted) {
                comment.permission = false;
                comment.usercode = -1;
                comment.content = '';
            } else {
                comment.permission = e.usercode == usercode;
            }
            if (e.parent) {
                // 불러오려는 대댓글들만 추출
                const childList = commentList.filter(
                    (child) =>
                        child.depth != depth &&
                        !(child.depth == depth + 1 && child.parentId != e.id),
                );
                const childComment: Comment[] = this.commentTree(
                    childList,
                    depth + 1,
                    usercode,
                );
                if (childComment.length) {
                    comment.child = childComment;
                }
            }
            result.push(comment);
        });
        return result;
    }
}

import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { User } from 'src/auth/user.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from 'src/board/entities/post.entity';
import { CommentEntity } from 'src/board/entities/comment.entity';
import { Comment } from 'src/board/comment.model';
import { plainToClass } from '@nestjs/class-transformer';
import { WriteCommentDTO } from 'src/board/dto/write-comment.dto';

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

    async writeComment(user: User, postId: number, dto: WriteCommentDTO) {
        const { depth, parentId, content } = dto;
        if (depth > 0 && parentId != 0) {
            const parentComment = await this.commentRepository.findOne({
                where: {
                    postId,
                    id: parentId
                }
            });
            if (parentComment === undefined || parentComment.depth != depth-1) throw new NotFoundException('Parent comment not found');
            if (!parentComment.parent) {
                await this.commentRepository.update({
                    id: parentId
                }, {
                    parent: true
                })
            }
        }

        const comment: CommentEntity = plainToClass(CommentEntity, {
            usercode: user.usercode,
            postId,
            ...dto,
            parentId: parentId == 0? null: parentId,
            created: new Date
        })

        await Promise.all([
            this.commentRepository.save(comment),
            this.postRepository.createQueryBuilder('post')
                .update()
                .set({commentCnt: () => 'commentCnt + 1'})
                .where('id = :postId', {postId})
                .execute()
        ])
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
                const childList = commentList.filter(child => child.depth != depth && !(child.depth == depth + 1 && child.parentId != e.id));
                const childComment: Comment[] = this.commentTree(childList, depth+1, usercode);
                if (childComment.length) {
                    comment.child = childComment;
                }
            }
            result.push(comment);
        });
        return result;
    }
}

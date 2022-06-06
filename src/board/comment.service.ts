import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { User } from 'src/auth/user';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from 'src/board/entities/post.entity';
import { CommentEntity } from 'src/board/entities/comment.entity';
import { Comment } from 'src/board/comment';
import { plainToClass } from '@nestjs/class-transformer';
import { WriteCommentDTO } from 'src/board/dto/write-comment.dto';
import { DeleteCommentDTO } from 'src/board/dto/delete-comment.dto';
import { DeletedComment } from 'src/board/deleted-comment';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(PostEntity)
        private postRepository: Repository<PostEntity>,
        @InjectRepository(CommentEntity)
        private commentRepository: Repository<CommentEntity>,
    ) {}

    async viewComment(user: User, postId: number) {
        const commentInfo = await this.commentRepository.createQueryBuilder('c')
            .select([
                'c.id id',
                'c.deleted deleted',
                'c.usercode usercode',
                'u.nickname nickname',
                'c.depth depth',
                'c.parent parent',
                'c.parentId parentId',
                'c.created created',
                'c.content content'
            ])
            .leftJoin('c.userFK', 'u')
            .where('c.postId = :postId', {postId})
            .getRawMany();
        return {
            comments: this.commentTree(commentInfo, 0, user.usercode)
        }
    }

    async writeComment(user: User, postId: number, dto: WriteCommentDTO) {
        const { depth, parentId } = dto;
        // 작성하려는 댓글이 대댓글 이라면
        if (depth > 0 || parentId != 0) {
            // 대댓글이면 부모 댓글이 이미 게시글과 연결되어있기 때문에
            // 존재하는 게시글인지 굳이 확인할 이유가 없음
            const parentComment = await this.commentRepository.findOne({
                where: {
                    postFK: postId,
                    id: parentId
                }
            });
            if (!parentComment || parentComment.depth != depth-1) throw new NotFoundException('Parent comment not found');
            // 부모 댓글로 설정되어 있지 않으면 설정함
            if (!parentComment.parent) {
                await this.commentRepository.update({
                    id: parentId
                }, {
                    parent: true
                })
            }
        } else {
            // 대댓글이 아니면 존재하는 게시글에서 작성하는 것인지 확인
            const postInfo = await this.postRepository.findOne({
                where: {
                    id: postId,
                    deleted: false
                }
            })
            if (!postInfo) throw new NotFoundException('Post not found');
        }

        const newComment: CommentEntity = plainToClass(CommentEntity, {
            userFK: user.usercode,
            postFK: postId,
            ...dto,
            parentId: parentId == 0? null: parentId,
            created: new Date
        })

        await Promise.all([
            this.commentRepository.save(newComment),
            // 총 댓글 수 카운팅
            this.postRepository.createQueryBuilder('post')
                .update()
                .set({commentCnt: () => 'commentCnt + 1'})
                .where('id = :postId', {postId})
                .execute()
        ])
    }

    async deleteComment(user: User, dto: DeleteCommentDTO) {
        const { postId, commentId } = dto;
        // 댓글 확인
        const comment = await this.commentRepository.findOne({
            where: {
                postFK: postId,
                id: commentId,
                deleted: false
            }
        });
        if (!comment) throw new NotFoundException('comment not found');
        if (comment.usercode != user.usercode) throw new ForbiddenException();

        await Promise.all([
            this.commentRepository.update({
                id: commentId
            }, {
                deleted: true
            }),
            // 총 댓글 수 카운팅
            this.postRepository.createQueryBuilder('post')
                .update()
                .set({commentCnt: () => 'commentCnt - 1'})
                .where('id = :postId', {postId})
                .execute()
        ])
    }

    private commentTree(
        commentList: CommentEntity[],
        depth: number,
        usercode: number,
    ) {
        let result: (Comment | DeletedComment)[] = [];
        commentList.forEach((e) => {
            // 대댓글의 깊이가 불러오려는 현재 깊이와 같은지 확인
            if (e.depth != depth) {
                return [];
            }
            const comment: (Comment | DeletedComment) = plainToClass(
                // 삭제된 댓글인지 확인
                e.deleted? DeletedComment: Comment,
                e, {excludeExtraneousValues: true}
            );
            if (e.parent) {
                // 불러오려는 대댓글들만 추출
                const childList = commentList.filter(child => child.depth != depth && !(child.depth == depth + 1 && child.parentId != e.id));
                const childComment: (Comment | DeletedComment)[] = this.commentTree(childList, depth+1, usercode);
                if (childComment.length) {
                    comment.child = childComment;
                }
            }
            result.push(comment);
        });
        return result;
    }
}

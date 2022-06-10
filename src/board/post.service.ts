import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { User } from 'src/auth/user';
import { Post } from 'src/board/post';
import { plainToClass } from '@nestjs/class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from './entities/category.entity';
import { PostEntity } from './entities/post.entity';
import { WritePostDTO } from 'src/board/dto/write-post.dto';
import { postListDTO } from 'src/board/dto/post-list.dto';
import { ViewPost } from 'src/board/view-post';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(CategoryEntity) private categoryRepository: Repository<CategoryEntity>,
        @InjectRepository(PostEntity) private postRepository: Repository<PostEntity>
    ) {
        (async () => {
            (await this.categoryRepository.find()).forEach(e => {
                this.categoryList[e.id] = e.name;
            });
        })();
    }

    private categoryList = {};

    async postList(dto: postListDTO) {
        // 총 게시글 수
        const totalPosts = await this.getTotalPosts(dto.category);
        // 현재 페이지로부터 가져오려는 게시글의 시작 id
        const startPost = (dto.page-1)*dto.limit;
        // 총 페이지 수
        const totalPage = Math.ceil(totalPosts/dto.limit);

        const posts: Post[] = (await this.getPostList(startPost, dto.limit, dto.category))
            .map(post => plainToClass(Post, {
                ...post,
                category: post.category == null? 'normal': post.category
            }, {excludeExtraneousValues: true}));

        return {
            posts,
            totalPage
        };
    }

    async viewPost(user: User, postId: number): Promise<ViewPost> {
        const { postInfo, permission } = await this.postCheck(postId, user.usercode);
        const post = plainToClass(ViewPost, {
            ...postInfo,
            category: postInfo.category == null? 'normal': postInfo.category
        }, {excludeExtraneousValues: true});
        post.permission = permission;
        return post;
    }

    async WritePost(user: User, dto: WritePostDTO) {
        if (!this.categoryList[dto.category]) {
            throw new BadRequestException('Category not found');
        }
        await this.savePost(user.usercode, dto);
        return;
    }
  
    async modifyPost(user: User, postId: number, dto: WritePostDTO) {
        if (!this.categoryList[dto.category]) {
            throw new BadRequestException('Category not found');
        }
        const { permission } = await this.postCheck(postId, user.usercode);
        if (!permission) {
            throw new ForbiddenException('No permission');
        }
        await this.updatePost(postId, dto);
    }
  
    async deletePost(user: User, postId: number) {
        const { permission } = await this.postCheck(postId, user.usercode);
        if (!permission) {
            throw new ForbiddenException('No permission');
        }
        await this.postRepository.update({
            id: postId
        }, {
            deleted: true
        });
    }

    private async savePost(
        usercode: number,
        dto: WritePostDTO
    ) {
        const { category, title, content } = dto;
        const post: PostEntity = plainToClass(PostEntity, {
            categoryFK: category == 'normal'? null: category,
            title,
            content,
            created: new Date,
            userFK: usercode
        });
        await this.postRepository.save(post);
    }
  
    private async updatePost(
        postId: number,
        dto: WritePostDTO
    ) {
        const { category, title, content } = dto;
        await this.postRepository.update({
            id: postId
        }, {
            categoryFK: category == 'normal'? null: category,
            title,
            content
        })
    }

    private async postCheck(postId: number, usercode: number) {
        const postInfo = await this.postRepository.createQueryBuilder('p')
            .select([
                'p.id id',
                'p.usercode usercode',
                'u.nickname nickname',
                'p.category category',
                'p.created created',
                'p.hit hit',
                'p.commentCnt commentCnt',
                'p.title title',
                'p.content content'
            ])
            .leftJoin('p.userFK', 'u')
            .where('p.deleted = 0')
            .getRawOne();
        if (!postInfo) {
            throw new NotFoundException('Post not found');
        }
        return {
            postInfo,
            permission: postInfo.usercode == usercode
        };
    }

    // 총 게시물 갯수 반환
    private async getTotalPosts(category: string): Promise<number> {
        let queryButinder = this.postRepository.createQueryBuilder('post')
            .select('COUNT(id) total')
            .where('deleted=0')
        // 카테고리 분류
        if (category != 'all') {
            if (category == 'normal') {
                queryButinder = queryButinder.where('category IS NULL');
            } else {
                queryButinder = queryButinder.where('category = :category', {category});
            }
        }
        const result = await queryButinder.getRawOne();
        // 에러 체크
        if (typeof result != 'object') {
            console.error(`Get total post Exception: ${result}`);
            throw new InternalServerErrorException();
        }
        return parseInt(result.total);
    }

    private async getPostList(
        startPost: number,
        limit: number,
        category: string
    ) {
        let queryButinder = this.postRepository.createQueryBuilder('p')
            .select([
                'p.id id',
                'p.usercode usercode',
                'u.nickname nickname',
                'p.category category',
                'p.created created',
                'p.hit hit',
                'p.commentCnt commentCnt',
                'p.title title'
            ])
            .leftJoin('p.userFK', 'u')
            .where('p.deleted = 0')
        // 카테고리 분류
        if (category != 'all') {
            if (category == 'normal') {
                queryButinder = queryButinder.andWhere('p.category IS NULL');
            } else {
                queryButinder = queryButinder.andWhere('p.category = :category', {category});
            }
        }
        return queryButinder.limit(limit)
            .offset(startPost)
            .orderBy('p.id', 'DESC')
            .getRawMany();
    }
}

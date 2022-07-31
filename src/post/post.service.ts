import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { User } from 'src/auth/user';
import { PostDto } from 'src/post/dto/post.dto';
import { plainToClass } from '@nestjs/class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOperator, IsNull, Repository } from 'typeorm';
import { CategoryEntity } from './entities/category.entity';
import { PostEntity } from '../post/entities/post.entity';
import { WritePostDTO } from 'src/post/dto/request/write-post.dto';
import { postListDTO } from 'src/post/dto/request/post-list.dto';
import { ViewPostDto } from 'src/post/dto/view-post.dto';

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
        const startPost = (dto.page - 1) * dto.limit;
        // 총 페이지 수
        const totalPage = Math.ceil(totalPosts / dto.limit);

        const posts: PostDto[] = (await this.getPostList(startPost, dto.limit, dto.category))
            .map(post => plainToClass(PostDto, {
                ...post,
                nickname: post.user.nickname,
                category: post.categoryId === null? 'normal': post.categoryId
            }, {excludeExtraneousValues: true}));

        return {
            posts,
            totalPage
        };
    }

    async viewPost(user: User, postId: number): Promise<ViewPostDto> {
        const { postInfo, permission } = await this.postCheck(postId, user.usercode);

        const post = plainToClass(ViewPostDto, {
            ...postInfo,
            nickname: postInfo.user.nickname,
            category: postInfo.category === null? 'normal': postInfo.category
        }, {excludeExtraneousValues: true});
        post.permission = permission;
        return post;
    }

    async WritePost(user: User, dto: WritePostDTO) {
        if (!this.categoryList[dto.category]) {
            throw new BadRequestException('Category not found');
        }

        await this.savePost(user.usercode, dto);
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
            categoryId: category === 'normal'? null: category,
            title,
            content,
            usercode
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
            categoryId: category === 'normal'? null: category,
            title,
            content
        })
    }

    private async postCheck(postId: number, usercode: number) {
        const postInfo = await this.postRepository.findOne({
            relations: ['user'],
            select: {
                user: {
                    nickname: true
                }
            },
            where: {
                deleted: false,
                id: postId
            }
        });
        if (!postInfo) {
            throw new NotFoundException('Post not found');
        }
        return {
            postInfo,
            permission: postInfo.usercode === usercode
        };
    }

    // 총 게시물 갯수 반환
    private async getTotalPosts(category: string): Promise<number> {
        return await this.postRepository.count({
            where: {
                deleted: false,
                categoryId: this.getCategoryOption(category)
            }
        });
    }

    private async getPostList(
        startPost: number,
        limit: number,
        category: string
    ): Promise<PostEntity[]> {
        return await this.postRepository.find({
            relations: ['user'],
            select: {
                user: {
                    nickname: true
                }
            },
            where: {
                deleted: false,
                categoryId: this.getCategoryOption(category)
            },
            take: limit,
            skip: startPost,
            order: {
                id: 'DESC'
            }
        });
    }
    private getCategoryOption(category: string): undefined | string | FindOperator<any> {
        if (category === 'all') {
            return undefined;
        }
        if (category === 'normal') {
            return IsNull();
        }
        return category;
    }
}

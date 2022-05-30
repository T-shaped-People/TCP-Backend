import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from './entities/category.entity';
import { PostEntity } from './entities/post.entity';
import { plainToClass } from '@nestjs/class-transformer';
import { User } from 'src/auth/user.model';
import { WritePostDTO } from 'src/board/dto/write-post.dto';
import { Post } from 'src/board/post.model';
import { postListDTO } from 'src/board/dto/post-list.dto';

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
    const totalPosts = await this.getTotalPosts(dto.category);
    const startPost = (dto.page-1)*dto.limit;
    const totalPage = Math.ceil(totalPosts/dto.limit);

    const posts: Post[] = (await this.getPostList(startPost, dto.limit, dto.category)).map(post => ({
      id: post.id,
      usercode: post.usercode,
      category: post.category,
      created: post.created,
      hit: post.hit,
      commentCnt: post.commentCnt,
      title: post.title
    }));

    return {
      posts,
      totalPage
    };
  }

  async viewPost(user: User, postId: number): Promise<Post> {
    const postInfo = await this.getPost(postId);
    if (postInfo === undefined) {
      throw new NotFoundException('Post not found');
    }
    const post = plainToClass(Post, postInfo, {excludeExtraneousValues: true});
    post.permission = postInfo.usercode == user.usercode;
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
    const postInfo = await this.getPost(postId);
    if (postInfo === undefined) {
      throw new NotFoundException('Post not found');
    }
    if (postInfo.usercode != user.usercode) {
      throw new ForbiddenException('No permission');
    }
    await this.updatePost(postId, dto);
  }
  
  private async savePost(
    usercode: number,
    dto: WritePostDTO
  ) {
    const post = new PostEntity();
    post.category = dto.category;
    post.title = dto.title;
    post.content = dto.content;
    post.created = new Date;
    post.usercode = usercode;
    await this.postRepository.save(post);
  }
  
  private async updatePost(
    postId: number,
    dto: WritePostDTO
  ) {
    await this.postRepository.update({
      id: postId
    }, {
      ...dto
    })
  }

  private async getPost(postId: number) {
    return this.postRepository.findOne({
      where: {
        id: postId,
        deleted: false
      }
    });
  }

  private async getTotalPosts(category: string): Promise<number> {
    let queryButinder = await this.postRepository.createQueryBuilder('post')
      .select('COUNT(id) total')
      .where('deleted=0')
    if (category != 'all') {
      if (category == 'normal') {
        queryButinder = queryButinder.where('category IS NULL');
      } else {
        queryButinder = queryButinder.where('category = :category', {category});
      }
    }
    const result = await queryButinder.getRawOne();
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
    let whereOption: {} = {
      deleted: false
    };
    if (category != 'all') {
      if (category == 'normal') {
        whereOption = {
          deleted: false,
          category: null
        };
      } else {
        whereOption = {
          deleted: false,
          category
        };
      }
    }

    return this.postRepository.find({
      where: whereOption,
      take: limit,
      skip: startPost,
      order: {
        id: 'DESC'
      },
    })
  }
}

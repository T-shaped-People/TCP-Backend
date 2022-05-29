import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
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
    const totalPosts = await this.getTotalPosts();
    const startPost = (dto.page-1)*dto.limit;
    console.log(startPost, dto.page)
    const totalPage = Math.ceil(totalPosts/dto.limit);

    return {
      posts: (await this.postRepository.find({
        where: {
          deleted: false
        },
        take: dto.limit,
        skip: startPost,
        order: {
          id: 'DESC'
        },
      })).map(post => ({
        id: post.id,
        usercode: post.usercode,
        category: post.category,
        created: post.created,
        hit: post.hit,
        commentCnt: post.commentCnt,
        title: post.title
      })),
      totalPage
    };
  }

  async WritePost(user: User, dto: WritePostDTO) {
    if (!this.categoryList[dto.category]) {
      throw new BadRequestException('Category not found');
    }
    await this.savePost(user.usercode, dto);
    return;
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

  private async getTotalPosts(): Promise<number> {
    let result = await this.postRepository.createQueryBuilder('post')
      .select('COUNT(id) total')
      .where('deleted=0')
      .getRawOne()
    if (typeof result != 'object') {
      console.error(`Get total post Exception: ${result}`);
      throw new InternalServerErrorException();
    }
    return parseInt(result.total);
  }
}

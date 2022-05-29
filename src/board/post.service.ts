import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from './entities/category.entity';
import { PostEntity } from './entities/post.entity';
import { plainToClass } from '@nestjs/class-transformer';
import { User } from 'src/auth/user.model';
import { WritePostDTO } from 'src/board/dto/write-post.dto';
import { Post } from 'src/board/post.model';

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

  async postList(): Promise<Post[]> {
    return (await this.postRepository.find({
      where: {
        deleted: false
      },
      order: {
        id: 'DESC'
      }
    })).map(post => ({
      id: post.id,
      usercode: post.usercode,
      category: post.category,
      created: post.created,
      hit: post.hit,
      commentCnt: post.commentCnt,
      title: post.title
    }));
  }

  async WritePost(user: User, dto: WritePostDTO) {
    console.log(this.categoryList)
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
}

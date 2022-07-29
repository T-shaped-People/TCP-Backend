import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassTransformer } from '@nestjs/class-transformer';
import { CategoryEntity } from 'src/post/entities/category.entity';
import { PostEntity } from 'src/post/entities/post.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryEntity, PostEntity]),
    ClassTransformer
  ],
  controllers: [PostController],
  providers: [PostService]
})
export class PostModule {}

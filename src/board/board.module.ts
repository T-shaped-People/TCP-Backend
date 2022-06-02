import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassTransformer } from '@nestjs/class-transformer';
import { CategoryEntity } from 'src/board/entities/category.entity';
import { PostEntity } from 'src/board/entities/post.entity';
import { CommentEntity } from 'src/board/entities/comment.entity';
import { CommentController } from 'src/board/comment.controller';
import { CommentService } from 'src/board/comment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryEntity, PostEntity, CommentEntity]),
    ClassTransformer
  ],
  controllers: [PostController, CommentController],
  providers: [PostService, CommentService]
})
export class BoardModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassTransformer } from '@nestjs/class-transformer';
import { CommentEntity } from 'src/comment/entities/comment.entity';
import { CommentController } from 'src/comment/comment.controller';
import { CommentService } from 'src/comment/comment.service';
import { PostEntity } from 'src/post/entities/post.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentEntity, PostEntity]),
    ClassTransformer
  ],
  controllers: [CommentController],
  providers: [CommentService]
})
export class CommentModule {}

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassTransformer } from '@nestjs/class-transformer';
import { CategoryEntity } from 'src/board/entities/category.entity';
import { PostEntity } from 'src/board/entities/post.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryEntity, PostEntity]),
    HttpModule,
    ClassTransformer
  ],
  controllers: [PostController],
  providers: [PostService]
})
export class BoardModule {}
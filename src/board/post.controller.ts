import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import JwtAuthGuard from 'src/auth/auth.guard';
import { GetUser } from 'src/auth/getUser.decorator';
import { User } from 'src/auth/user';
import { postListDTO } from 'src/board/dto/post-list.dto';
import { WritePostDTO } from 'src/board/dto/write-post.dto';
import { PostService } from './post.service';

@UseGuards(JwtAuthGuard)
@Controller('board/post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  postList(@Query() dto: postListDTO) {
    return this.postService.postList(dto);
  }

  @Get(':postId')
  viewPost(
    @GetUser() user: User,
    @Param('postId') postId: number
  ) {
    return this.postService.viewPost(user, postId);
  }

  @Post()
  writePost(
    @GetUser() user: User,
    @Body() dto: WritePostDTO
  ) {
    return this.postService.WritePost(user, dto);
  }

  @Put(':postId')
  modifyPost(
    @GetUser() user: User,
    @Body() dto: WritePostDTO,
    @Param('postId') postId: number
  ) {
    return this.postService.modifyPost(user, postId, dto);
  }

  @Delete(':postId')
  deletePost(
    @GetUser() user: User,
    @Param('postId') postId: number
  ) {
    return this.postService.deletePost(user, postId);
  }
}

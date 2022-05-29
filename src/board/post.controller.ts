import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import JwtAuthGuard from 'src/auth/auth.guard';
import { GetUser } from 'src/auth/getUser.decorator';
import { User } from 'src/auth/user.model';
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

  @Post()
  writePost(
    @GetUser() user: User,
    @Body() dto: WritePostDTO
  ) {
    return this.postService.WritePost(user, dto);
  }
}

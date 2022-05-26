import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';

@Controller('board/post')
export class PostController {
  constructor(private readonly postService: PostService) {}
}

import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import JwtAuthGuard from 'src/auth/auth.guard';
import { GetUser } from 'src/auth/getUser.decorator';
import { User } from 'src/auth/user';
import { postListDTO } from 'src/post/dto/request/post-list.dto';
import { WritePostDTO } from 'src/post/dto/request/write-post.dto';
import { TeamGuard } from 'src/team/team.guard';
import { PostService } from './post.service';

@UseGuards(JwtAuthGuard)
@Controller('board/post')
export class PostController {
  constructor(private readonly postService: PostService) {}

    @Get()
    postList(
        @Query() dto: postListDTO
    ) {
        return this.postService.postList(dto);
    }

    @Get('team')
    @UseGuards(TeamGuard)
    teamPostList(
        @Query() dto: postListDTO,
        @Query('teamId') teamId: string
    ) {
        return this.postService.postList(dto, teamId);
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
        return this.postService.WritePost(user, dto, false);
    }

    @Post('team')
    @UseGuards(TeamGuard)
    writeTeamPost(
        @GetUser() user: User,
        @Body() dto: WritePostDTO
    ) {
        return this.postService.WritePost(user, dto, true);
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

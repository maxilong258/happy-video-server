import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostDto, findPostsDto } from './dto/post.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { Request } from 'express';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  //新增Post，并通知所有订阅者
  @Post()
  @UseGuards(JwtGuard)
  create(@Req() req: Request, @Body() createPostDto: PostDto) {
    return this.postsService.create(createPostDto, req.user);
  }

  @Get()
  findAll(@Query() query: findPostsDto) {
    return this.postsService.findAll(query);
  }

  @Get('my')
  @UseGuards(JwtGuard)
  findMyPosts(@Query() query: findPostsDto, @Req() req: Request) {
    return this.postsService.findMyPosts(query, req.user);
  }

  @Get('user/:id')
  findUserPosts(@Param('id') id: string, @Query() query: findPostsDto) {
    return this.postsService.findUserPosts(+id, query);
  }

  @Patch('views/:id')
  addViews(@Param('id') id: string) {
    return this.postsService.addViews(+id);
  }

  @Patch('like/:id')
  @UseGuards(JwtGuard)
  addLikes(@Param('id') id: string, @Req() req: Request) {
    return this.postsService.addLikes(+id, req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query() {userId}: {userId: string}) {
    return this.postsService.findOne(+id, +userId);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  update(@Param('id') id: string, @Body() updatePostDto: PostDto, @Req() req: Request) {
    return this.postsService.update(+id, updatePostDto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  remove(@Param('id') id: string,  @Req() req: Request) {
    return this.postsService.remove(+id, req.user);
  }

  
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query
} from '@nestjs/common'
import { CommentsService } from './comments.service'
import { CreateCommentDto } from './dto/create-comment.dto'
import { UpdateCommentDto } from './dto/update-comment.dto'
import { JwtGuard } from 'src/guards/jwt.guard'
import { Request } from 'express'
import { getCommentByPostDto } from './dto/comment.dto'

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(JwtGuard)
  create(@Body() createCommentDto: CreateCommentDto, @Req() req: Request) {
    return this.commentsService.create(createCommentDto, req.user)
  }

  @Get()
  findAll() {
    return this.commentsService.findAll()
  }

  @Patch('like/:id')
  @UseGuards(JwtGuard)
  like(@Param('id') id: string, @Req() req: Request) {
    return this.commentsService.like(+id, req.user)
  }

  @Get('post/:id')
  findByPost(@Query() query: getCommentByPostDto, @Param('id') postId: string) {
    return this.commentsService.findByPost(query, +postId)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(+id, updateCommentDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(+id)
  }
}

import { Module } from '@nestjs/common'
import { PostsService } from './posts.service'
import { PostsController } from './posts.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Post } from './entities/post.entity'
import { PostLikeRecord } from './entities/post-like-record.entity'
import { UserFollow } from 'src/user/entities/user-follow.entity'
import { UserCollect } from 'src/user/entities/user-collect.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, PostLikeRecord, UserFollow, UserCollect])
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService]
})
export class PostsModule {}

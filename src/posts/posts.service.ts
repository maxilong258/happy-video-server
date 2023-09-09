import { ForbiddenException, Injectable } from '@nestjs/common'
import { PostDto, findPostsDto } from './dto/post.dto'
import { Post } from './entities/post.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Like, Repository } from 'typeorm'
import { conditionUtils } from 'src/utils/db.helper'
import { PostLikeRecord } from './entities/post-like-record.entity'
import { UserFollow } from 'src/user/entities/user-follow.entity'
import { UserCollect } from 'src/user/entities/user-collect.entity'

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(PostLikeRecord)
    private readonly postLikeRepository: Repository<PostLikeRecord>,
    @InjectRepository(UserFollow)
    private readonly userFollowRepository: Repository<UserFollow>,
    @InjectRepository(UserCollect)
    private readonly userCollectRepository: Repository<UserCollect>
  ) {}
  async create(createPostDto: PostDto, user: any) {
    const { userId } = user
    const newPost = {
      user: userId,
      likes: 0,
      views: 0,
      createTime: new Date(),
      ...createPostDto
    }
    const post = this.postRepository.create(newPost)

    //通知所有订阅者我有更新
    const followingUsers = await this.userFollowRepository
      .createQueryBuilder('userFollow')
      .leftJoinAndSelect('userFollow.followed', 'followed')
      .where('userFollow.followed.id = :userId', { userId })
      .getMany()

    followingUsers.forEach(async (item) => {
      item.followedHasNewPost = new Date()
      const res = await this.userFollowRepository.save(item)
    })

    return this.postRepository.save(post)
  }

  findAll(query: findPostsDto) {
    const { page, limit, title } = query
    const take = +limit || 30
    const skip = ((+page || 1) - 1) * take
    const selectQuery = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('user.userProfile', 'userProfile')
      .select(['post', 'user.username', 'user.id', 'userProfile.avatar'])
      .orderBy('post.createTime', 'DESC')

    const selectAndWhereQuery = conditionUtils<Post>(selectQuery, {
      'post.title': title
    }, true)

    const queryBuilder = selectAndWhereQuery.take(take).skip(skip).getMany()
    return queryBuilder
  }

  async findMyPosts(query: findPostsDto, user: any) {
    const { type, page, limit } = query
    const take = +limit || 20
    const skip = ((+page || 1) - 1) * take
    const selectQuery = this.postRepository.createQueryBuilder('post')
    const selectAndWhereQuery = conditionUtils<Post>(selectQuery, {
      'post.user.id': user.userId,
      'post.type': type
    })
    const [posts, total] = await selectAndWhereQuery
      .orderBy('post.createTime', 'DESC')
      .take(take)
      .skip(skip)
      .getManyAndCount()
    return {posts, total}
  }

  findUserPosts(id: number, query: findPostsDto) {
    const { page, limit } = query
    const take = +limit || 20
    const skip = ((+page || 1) - 1) * take
    return this.postRepository
      .createQueryBuilder('post')
      .where('post.user.id = :id', { id })
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('user.userProfile', 'userProfile')
      .select(['post', 'user.username', 'user.id', 'userProfile.avatar'])
      .orderBy('post.createTime', 'DESC')
      .take(take)
      .skip(skip)
      .getMany()
  }

  async findOne(id: number, userId?: number) {
    const postInfo = await this.postRepository
      .createQueryBuilder('post')
      .where('post.id = :id', { id })
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('user.userProfile', 'userProfile')
      .select([
        'post',
        'user.username',
        'user.id',
        'userProfile.avatar',
        'userProfile.subscribers'
      ])
      .getOne()
    if (!userId) return postInfo
    const likeRecord = await this.postLikeRepository.findOne({
      where: { post: { id }, user: { id: userId } }
    })
    postInfo.isLiked = likeRecord ? true : false
    const SaveRecord = await this.userCollectRepository.findOne({
      where: { post: { id }, user: { id: userId } }
    })
    postInfo.isSaved = SaveRecord ? true : false
    return postInfo
  }

  async addLikes(postId: number, user: any) {
    const userId: number = user.userId
    const record = await this.postLikeRepository.findOne({
      where: { post: { id: postId }, user: { id: userId } }
    })
    if (record) {
      await this.postRepository.decrement({ id: postId }, 'likes', 1)
      return this.decrementPostLikes(record.id)
    }
    const newRecord = this.postLikeRepository.create({
      post: { id: postId },
      user: { id: userId },
      isLiked: true
    })
    await this.postRepository.increment({ id: postId }, 'likes', 1)
    return this.postLikeRepository.save(newRecord)
  }

  async update(id: number, updatePostDto: PostDto, user: any) {
    const post = await this.findOne(id)
    if (post.user.id !== user.userId) {
      throw new ForbiddenException('You are not authorized to update this post')
    }
    const newPost = this.postRepository.merge(post, updatePostDto)
    return this.postRepository.save(newPost)
  }

  async remove(id: number, user: any) {
    const post = await this.findOne(id)
    if (post.user.id !== user.userId) {
      throw new ForbiddenException('You are not authorized to delete this post')
    }
    return this.postRepository.remove(post)
  }

  async addViews(id: number) {
    this.postRepository.increment({ id }, 'views', 1)
  }

  decrementPostLikes(id: number) {
    return this.postLikeRepository.delete(id)
  }
}

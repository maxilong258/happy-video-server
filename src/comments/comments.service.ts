import { BadRequestException, ForbiddenException, HttpException, Injectable, UnauthorizedException } from '@nestjs/common'
import { CreateCommentDto } from './dto/create-comment.dto'
import { UpdateCommentDto } from './dto/update-comment.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { Comment } from './entities/comment.entity'
import { CommentLikeRecord } from './entities/comment-like-record.entity'
import { getCommentByPostDto } from './dto/comment.dto'

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(CommentLikeRecord)
    private readonly likeRecordRepository: Repository<CommentLikeRecord>
  ) {}
  async create(createCommentDto: CreateCommentDto, user: any) {
    const newComment = {
      content: createCommentDto.content,
      likes: 0,
      createTime: new Date(),
      user: user.userId,
      post: { id: createCommentDto.postId }
    }
    const comment = this.commentRepository.create(newComment)
    return this.commentRepository.save(comment)
  }

  async like(commentId: number, user: any) {
    const userId: number = user.userId
    const record = await this.likeRecordRepository.findOne({
      where: { comment: { id: commentId }, user: { id: userId } }
    })
    if (record) {
      await this.commentRepository.decrement({ id: commentId }, 'likes', 1)
      return this.decrementCommentLikes(record.id)
    }
    const newRecord = this.likeRecordRepository.create({
      comment: { id: commentId },
      user: { id: userId },
      isLiked: true
    })
    await this.commentRepository.increment({ id: commentId }, 'likes', 1)
    return this.likeRecordRepository.save(newRecord)
  }

  findAll() {
    return `This action returns all comments`
  }

  async findOne(id: number) {
    return await this.commentRepository.findOne({ where: { id } })
  }

  async findByPost(query: getCommentByPostDto, postId: number) {
    const { page, limit, userId } = query
    const take = +limit || 20
    const skip = ((+page || 1) - 1) * take
    const comments = await this.commentRepository
      .createQueryBuilder('comment')
      .where({ post: { id: postId } })
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('user.userProfile', 'userProfile')
      .select(['comment', 'user.id', 'user.username', 'userProfile.avatar'])
      .orderBy('comment.createTime', 'DESC')
      .take(take)
      .skip(skip)
      .getMany()
    
    const total = comments.length

    if (!userId) return {comments, total}
    //查询此用户对每条评论的点赞情况
    const commentIds = comments.map((c) => c.id)
    const likeRecords = await this.likeRecordRepository.find({
      where: { comment: In(commentIds), user: {id: +userId} },
      relations: ['comment']
    })
    const likedCommentIds = likeRecords.map((r) => r.comment.id)
    comments.forEach((c) => {
      c.isLiked = likedCommentIds.includes(c.id)
    })
    return {comments, total}
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`
  }

  decrementCommentLikes(id: number) {
    return this.likeRecordRepository.delete(id)
  }

  remove(id: number) {
    return `This action remove ${id} comment`
  }
}

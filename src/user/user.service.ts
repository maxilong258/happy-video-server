import { ForbiddenException, Injectable } from '@nestjs/common'
import { CreateUserDto, UpdateUserDto } from './dto/user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Repository } from 'typeorm'
import { GetUserDto } from './dto/user.dto'
import { conditionUtils } from 'src/utils/db.helper'
import * as argon2 from 'argon2'
import { UserFollow } from './entities/user-follow.entity'
import { UserCollect } from './entities/user-collect.entity'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserFollow)
    private readonly userFollowRepository: Repository<UserFollow>,
    @InjectRepository(UserCollect)
    private readonly userCollectRepository: Repository<UserCollect>
  ) {}

  async create(createUserDto: CreateUserDto) {
    const userData = {
      username: createUserDto.username,
      email: createUserDto.email,
      userPassword: {
        password: createUserDto.password
      },
      userSettings: {
        theme: 'light'
      },
      userProfile: {
        avatar: '',
        country: '',
        address: '',
        birthday: '',
        background: '',
        introduction: '',
        subscribers: 0
      }
    }
    const user = this.userRepository.create(userData)
    user.userPassword.password = await argon2.hash(user.userPassword.password)
    return this.userRepository.save(user)
  }

  findAll(query: GetUserDto) {
    const { page, limit, username } = query
    const take = +limit || 20
    const skip = ((+page || 1) - 1) * take
    const selectQuery = this.userRepository
      .createQueryBuilder('user')
      // .leftJoinAndSelect('user.userSettings', 'userSettings')
      .leftJoinAndSelect('user.userProfile', 'userProfile')
    const selectAndWhereQuery = conditionUtils<User>(selectQuery, {
      'user.username': username
    })
    const queryBuilder = selectAndWhereQuery.take(take).skip(skip).getMany()
    return queryBuilder
  }

  getCreatorProfile(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: ['userProfile']
    })
  }

  findOne(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: ['userSettings', 'userProfile']
    })
  }

  findByUsername(username: string) {
    return this.userRepository.findOne({
      where: { username },
      relations: ['userSettings', 'userProfile']
    })
  }

  findUserForAuth(email: string) {
    return this.userRepository.findOne({
      where: { email },
      relations: ['userSettings', 'userProfile', 'userPassword']
    })
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id)
    const newUser = this.userRepository.merge(user, updateUserDto)
    return this.userRepository.save(newUser)
  }

  async remove(id: number) {
    const user = await this.findOne(id)
    return this.userRepository.remove(user)
  }

  async subscribe(
    followerId: number,
    followedId: number,
    checkIsSubscribe: boolean = false
  ) {
    if (followerId === followedId) {
      if (checkIsSubscribe) return { subscribeStatus: false }
      throw new ForbiddenException('Cannot subscribe yourself')
    }

    const followedUser = await this.userRepository.findOne({
      where: { id: followedId },
      relations: ['userProfile']
    })
    if (!followedUser) {
      throw new ForbiddenException('Followed user not found')
    }

    // 检查是否已关注
    const existingUserFollow = await this.userFollowRepository
      .createQueryBuilder('userFollow')
      .where('userFollow.follower.id = :followerId', { followerId })
      .andWhere('userFollow.followed.id = :followedId', { followedId })
      .getOne()

    if (existingUserFollow) {
      if (checkIsSubscribe) return { subscribeStatus: true }
      // 如果已关注，则取消关注
      await this.userFollowRepository.remove(existingUserFollow)
      followedUser.userProfile.subscribers -= 1
      await this.userRepository.save(followedUser)
      return 'User unfollowed successfully.'
    }
    if (checkIsSubscribe) return { subscribeStatus: false }
    const follower = await this.userRepository.findOne({
      where: { id: followerId }
    })
    const followed = await this.userRepository.findOne({
      where: { id: followedId }
    })

    const userFollow = this.userFollowRepository.create({
      follower,
      followed,
      followedAt: new Date()
    })

    await this.userFollowRepository.save(userFollow)
    followedUser.userProfile.subscribers += 1
    await this.userRepository.save(followedUser)
    return 'User followed successfully.'
  }

  async getMyFollowing(
    userId: number,
    query: { page?: number; limit?: number }
  ) {
    const { page, limit } = query
    const take = limit || 50
    const skip = ((page || 1) - 1) * take
    const [followings, total] = await this.userFollowRepository
      .createQueryBuilder('userFollow')
      .leftJoinAndSelect('userFollow.followed', 'followed')
      .leftJoinAndSelect('followed.userProfile', 'userProfile')
      .select(['userFollow', 'followed', 'userProfile.avatar'])
      .where('userFollow.follower.id = :userId', { userId })
      .orderBy('userFollow.followedHasNewPost', 'DESC')
      .addOrderBy('userFollow.followedAt', 'DESC')
      .take(take)
      .skip(skip)
      .getManyAndCount()
    return {followings, total}
  }

  async getMyFollowers(
    userId: number,
    query: { page?: number; limit?: number }
  ) {
    const { page, limit } = query
    const take = limit || 50
    const skip = ((page || 1) - 1) * take
    const[followers, total ] = await this.userFollowRepository
      .createQueryBuilder('userFollow')
      .leftJoinAndSelect('userFollow.follower', 'follower')
      .leftJoinAndSelect('follower.userProfile', 'userProfile')
      .select(['userFollow', 'follower', 'userProfile.avatar'])
      .where('userFollow.followed.id = :userId', { userId })
      .addOrderBy('userFollow.followedAt', 'DESC')
      .take(take)
      .skip(skip)
      .getManyAndCount()
    return {followers, total}
  }
  //移除订阅更新通知
  async removeNewPostNotification(creatorId: number, userId: number) {
    const followStatus = await this.userFollowRepository
    .createQueryBuilder('userFollow')
    .where('userFollow.followed.id = :creatorId', { creatorId })
    .andWhere('userFollow.follower.id = :userId', { userId })
    .getOne()
    
    followStatus.followedHasNewPost = null
    return this.userFollowRepository.save(followStatus)
  }

  //我的收藏列表增删
  async addCollect(userId: number, postId: number) {
    const collectRecord = await this.userCollectRepository.findOne({
      where: { user: { id: userId }, post: { id: postId }}
    })
    if (collectRecord) {
      //取消收藏
      return this.userCollectRepository.delete(collectRecord.id)
    }
    const newCollectRecord = this.userCollectRepository.create({
      user: {id: userId},
      post: {id: postId},
      saveAt: new Date()
    })
    return await this.userCollectRepository.save(newCollectRecord)
  }

  async getMyCollect(userId: number, {page, limit}: { page?: string; limit?: string }) {
    const take = +limit || 50
    const skip = ((+page || 1) - 1) * take
    const collectRecords = await this.userCollectRepository
      .createQueryBuilder('userCollect')
      .leftJoinAndSelect('userCollect.post', 'post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('user.userProfile', 'userProfile')
      .select(['userCollect', 'post', 'user', 'userProfile.avatar'])
      .where('userCollect.user.id = :userId', { userId })
      .orderBy('userCollect.saveAt', 'DESC')
      .take(take)
      .skip(skip)
      .getMany()
    return collectRecords
  }
}

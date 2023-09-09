import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany
} from 'typeorm'
import { UserSettings } from './user-settings.entity'
import { Post } from 'src/posts/entities/post.entity'
import { UserProfile } from './user-profile.entity'
import { Comment } from 'src/comments/entities/comment.entity'
import { CommentLikeRecord } from 'src/comments/entities/comment-like-record.entity'
import { UserPassword } from './user-password.entity'
import { PostLikeRecord } from 'src/posts/entities/post-like-record.entity'
import { UserFollow } from './user-follow.entity'
import { UserCollect } from './user-collect.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  username: string

  @Column({ unique: true })
  email: string

  @OneToOne(() => UserPassword, (userPassword) => userPassword.user, {
    cascade: true
  })
  userPassword: UserPassword

  @OneToOne(() => UserSettings, (userSettings) => userSettings.user, {
    cascade: true
  })
  userSettings: UserSettings

  @OneToOne(() => UserProfile, (userProfile) => userProfile.user, {
    cascade: true
  })
  userProfile: UserProfile

  // 我的关注
  @OneToMany(() => UserFollow, (userFollow) => userFollow.follower)
  following: UserFollow[]

  // 我的粉丝
  @OneToMany(() => UserFollow, (userFollow) => userFollow.followed)
  followers: UserFollow[]

  @OneToMany(() => Post, (posts) => posts.user, { cascade: true })
  posts: Post[]

  @OneToMany(() => Comment, (comments) => comments.user, { cascade: true })
  comments: Comment[]

  @OneToMany(() => UserCollect, (userCollect) => userCollect.user, { cascade: true })
  collect: UserCollect[]

  @OneToMany(() => CommentLikeRecord, (record) => record.comment)
  commentLikeRecords: CommentLikeRecord[]

  @OneToMany(() => PostLikeRecord, (record) => record.post)
  postLikeRecords: PostLikeRecord[]

}

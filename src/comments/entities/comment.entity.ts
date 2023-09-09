import { Post } from 'src/posts/entities/post.entity'
import { User } from 'src/user/entities/user.entity'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm'
import { CommentLikeRecord } from './comment-like-record.entity'

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'longtext' })
  content: string

  @Column()
  createTime: Date

  @Column()
  likes: number

  @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' })
  @JoinColumn()
  post: Post

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn()
  user: User

  @OneToMany(() => CommentLikeRecord, (record) => record.comment)
  commentLikeRecords: CommentLikeRecord[]

  isLiked: boolean
}

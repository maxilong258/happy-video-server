import { User } from 'src/user/entities/user.entity'
import { Comment } from './comment.entity'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class CommentLikeRecord {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Comment, (comment) => comment.commentLikeRecords, {
    onDelete: 'CASCADE'
  })
  comment: Comment

  @ManyToOne(() => User, (user) => user.commentLikeRecords)
  user: User

  @Column()
  isLiked: boolean
}

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { User } from './user.entity'
import { Post } from 'src/posts/entities/post.entity'

@Entity()
export class UserCollect {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User, (user) => user.collect)
  user: User

  @ManyToOne(() => Post, (post) => post.collect, { onDelete: 'CASCADE' })
  post: Post

  @Column()
  saveAt: Date
}

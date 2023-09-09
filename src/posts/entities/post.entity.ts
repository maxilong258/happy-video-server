import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Comment } from "src/comments/entities/comment.entity";
import { PostLikeRecord } from "./post-like-record.entity";
import { UserCollect } from "src/user/entities/user-collect.entity";



@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  type: 'video' | 'painting'

  @Column()
  title: string

  @Column({type: 'longtext'})
  introduct: string

  @Column({default: ''})
  coverPic: string
 
  @Column()
  likes: number

  @Column()
  views: number

  @Column()
  createTime: Date

  @Column()
  source?: string

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn()
  user: User;

  @OneToMany(() => Comment, (comment) => comment.post, { cascade: true })
  comments: Comment[]

  @OneToMany(() => UserCollect, (userCollect) => userCollect.post, { cascade: true })
  collect: UserCollect[]

  @OneToMany(() => PostLikeRecord, record => record.post)
  postLikeRecords: PostLikeRecord[];

  isLiked: boolean

  isSaved: boolean
}
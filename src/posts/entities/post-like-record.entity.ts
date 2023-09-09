import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./post.entity";

@Entity()
export class PostLikeRecord {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Post, post => post.postLikeRecords)
  post: Post;

  @ManyToOne(() => User, user => user.postLikeRecords)
  user: User;

  @Column()
  isLiked: boolean;

}
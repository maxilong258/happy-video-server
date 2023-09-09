import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { User } from './user.entity'

@Entity()
export class UserFollow {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User, user => user.following)
  follower: User;

  @ManyToOne(() => User, user => user.followers)
  followed: User;

  @Column()
  followedAt: Date;

  @Column({default: null})
  followedHasNewPost: Date | null;
}

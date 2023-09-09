import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm'
import { User } from './user.entity'

@Entity()
export class UserProfile {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  avatar: string

  @Column()
  country: string

  @Column()
  address: string

  @Column()
  birthday: string

  @Column()
  background: string

  @Column({type: 'longtext'})
  introduction: string

  @Column()
  subscribers: number
  
  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User
}

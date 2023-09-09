import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm'
import { User } from './user.entity'

@Entity()
export class UserPassword {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  password: string

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User
}

import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm'
import { User } from './user.entity'

@Entity()
export class UserSettings {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  theme: string

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User
}

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import User from './user.entity';
import { Exclude } from 'class-transformer';

@Entity()
@Exclude()
export default class Token {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public token!: string;

  @ManyToOne(() => User, user => user.tokens)
  @JoinColumn()
  public user!: User;
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import User from './User';

@Entity()
export default class Token {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public token: string;

  @ManyToOne(type => User, user => user.tokens)
  @JoinColumn()
  public user: User;
}

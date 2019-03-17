import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import User from './User';

@Entity()
export default class Token {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public token: string;

  @ManyToOne(type => User, user => user.tokens) // eslint-disable-line @typescript-eslint/no-unused-vars
  public user: User;
}

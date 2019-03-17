import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import Token from './Token';

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column()
  public email: string;

  @Column({ nullable: true })
  public photo: string;

  @Column()
  public password: string;

  @OneToMany(type => Token, token => token.user) // eslint-disable-line @typescript-eslint/no-unused-vars
  public tokens: Token[];
}

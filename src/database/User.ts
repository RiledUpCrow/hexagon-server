/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import Token from './Token';
import Engine from './Engine';
import Game from './Game';

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

  @OneToMany(type => Token, token => token.user)
  public tokens: Token[];

  @ManyToMany(type => Engine, engine => engine.admins)
  public engines: Engine[];

  @ManyToMany(type => Game, game => game.players)
  public games: Game[];
}

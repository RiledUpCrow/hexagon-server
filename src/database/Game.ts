/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
} from 'typeorm';
import Engine from './Engine';
import User from './User';

@Entity()
export default class Game {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(type => Engine, engine => engine.games, { nullable: false })
  @JoinColumn()
  public engine: Engine;

  @ManyToMany(type => User, user => user.games)
  @JoinColumn()
  public players: User[];
}

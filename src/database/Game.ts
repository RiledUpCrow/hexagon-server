/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
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
  @JoinTable()
  public players: User[];
}

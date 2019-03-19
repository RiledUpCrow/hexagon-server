/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import User from './User';
import Game from './Game';

@Entity()
export default class Engine {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public engineId: string;

  @Column()
  public adminToken: string;

  @ManyToMany(type => User, admin => admin.engines)
  @JoinColumn()
  public admins: User[];

  @OneToMany(type => Game, game => game.engine)
  public games: Game[];
}

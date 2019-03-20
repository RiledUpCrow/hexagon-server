/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Engine from './Engine';
import Settings from './Settings';
import User from './User';

@Entity()
export default class Game {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public gameId: string;

  @ManyToOne(type => Engine, engine => engine.games, { nullable: false })
  @JoinColumn()
  public engine: Engine;

  @OneToOne(type => Settings)
  @JoinColumn()
  public settings: Settings;

  @Column()
  public started: boolean;

  @Column()
  public ended: boolean;

  @ManyToOne(type => User, { nullable: true })
  @JoinColumn()
  public activePlayer?: User;

  @ManyToMany(type => User, user => user.games)
  @JoinTable()
  public players: User[];
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';
import User from './User';
import Game from './Game';

@Entity()
export default class Engine {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public engineId!: string;

  @Column()
  public displayName!: string;

  @Column()
  public adminToken!: string;

  @Column()
  public open!: boolean;

  @ManyToMany(type => User, admin => admin.engines)
  @JoinTable()
  public admins!: User[];

  @OneToMany(type => Game, game => game.engine)
  public games!: Game[];
}

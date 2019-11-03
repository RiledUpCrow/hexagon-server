import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import Engine from '../engine/engine.entity';
import Game from '../database/Game';
import Token from './token.entity';
import { Exclude } from 'class-transformer';

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  @Exclude()
  public id!: number;

  @Column()
  public name!: string;

  @Column()
  @Exclude()
  public email!: string;

  @Column({ nullable: true })
  public photo!: string;

  @Column()
  @Exclude()
  public password!: string;

  @OneToMany(() => Token, token => token.user)
  @Exclude()
  public tokens!: Token[];

  @ManyToMany(() => Engine, engine => engine.admins)
  public engines!: Engine[];

  @ManyToMany(() => Game, game => game.players)
  public games!: Game[];
}

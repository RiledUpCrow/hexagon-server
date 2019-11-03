import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';
import User from '../database/User';
import Game from '../database/Game';
import { Exclude, Expose } from 'class-transformer';

@Entity()
export default class Engine {
  @PrimaryGeneratedColumn()
  @Exclude()
  public id!: number;

  @Column()
  @Expose({ name: 'id' })
  public engineId!: string;

  @Column()
  @Expose({ name: 'name' })
  public displayName!: string;

  @Column()
  @Exclude()
  public adminToken!: string;

  @Column()
  @Exclude()
  public authToken!: string;

  @Column()
  public open!: boolean;

  @ManyToMany(() => User, admin => admin.engines)
  @JoinTable()
  public admins!: User[];

  @OneToMany(() => Game, game => game.engine)
  public games!: Game[];
}

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
  public authToken!: string;

  @Column()
  public open!: boolean;

  @ManyToMany(() => User, admin => admin.engines)
  @JoinTable()
  public admins!: User[];

  @OneToMany(() => Game, game => game.engine)
  public games!: Game[];
}

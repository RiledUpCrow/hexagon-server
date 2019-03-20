import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Settings {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public maxPlayers: number;

  @Column()
  public mapWidth: number;

  @Column()
  public mapHeight: number;
}

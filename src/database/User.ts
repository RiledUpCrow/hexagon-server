import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  public readonly id: number;

  @Column()
  public readonly name: string;

  @Column()
  public readonly email: string;

  @Column()
  public readonly photo: string;
}

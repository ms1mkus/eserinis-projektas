import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
} from "typeorm";
import { Lake } from "./lake";
import { CaughtFish } from "./caughtFish";

@Entity()
export class Fish {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  description: string;

  @Column({ length: 100 })
  name: string;

  @OneToMany(() => CaughtFish, (caughtFish) => caughtFish.fish)
  caughtBy: CaughtFish[];
}

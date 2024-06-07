import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { User } from "./user";
import { Fish } from "./fish";
import { Lake } from "./lake";

@Entity()
export class CaughtFish {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.caughtFishes)
  user: User;

  @ManyToOne(() => Fish, (fish) => fish.caughtBy)
  fish: Fish;

  @ManyToOne(() => Lake, (lake) => lake.caughtFishes)
  lake: Lake;

  @Column()
  caughtAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}

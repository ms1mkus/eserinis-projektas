import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user";
import { Lake } from "./lake";

@Entity()
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.likes)
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToOne(() => Lake, (lake) => lake.likes)
  @JoinColumn({ name: "lakeId" })
  lake: Lake;
}

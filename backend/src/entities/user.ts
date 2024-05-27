import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import bcrypt from "bcryptjs";
import { CaughtFish } from "./caughtFish";
import { Like } from "./like";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @CreateDateColumn({ nullable: false })
  createdAt!: Date;

  @UpdateDateColumn({ nullable: false })
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt!: Date | null;

  @Column({ nullable: false, unique: true, length: 20 })
  username!: string;

  @Column({ nullable: false, unique: true, length: 255 })
  email!: string;

  @Column({ nullable: false })
  hashPassword!: string;

  @Column({ nullable: false })
  salt!: string;

  @OneToMany(() => CaughtFish, (caughtFish) => caughtFish.user)
  caughtFishes: CaughtFish[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  setPassword(password: string) {
    this.salt = bcrypt.genSaltSync(12);
    this.hashPassword = bcrypt.hashSync(password, this.salt);
  }

  verifyPassword(password: string) {
    const hash = bcrypt.hashSync(password, this.salt);
    return hash === this.hashPassword;
  }
}

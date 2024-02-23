import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Lake {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  area: number;

  @Column('decimal', { precision: 10, scale: 2 })
  depth: number;
}

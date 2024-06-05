import { Entity, PrimaryGeneratedColumn, Column, Index, Point } from "typeorm";

@Entity()
export class Lake {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column("decimal", { precision: 10, scale: 2 })
  area: number;

  @Column("decimal", { precision: 10, scale: 2 })
  depth: number;

  @Column({ length: 100 })
  description: string;

  @Index({ spatial: true })
  @Column({
    type: "geography",
    spatialFeatureType: "Point",
    srid: 4326,
    nullable: true,
  })
  location: Point;
}

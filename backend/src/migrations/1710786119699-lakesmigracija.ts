import { MigrationInterface, QueryRunner } from "typeorm";

export class Lakesmigracija1710786119699 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO "lake" ("name", "area", "depth")
        VALUES
          ('Šventinės ežeras', 100.0, 10.5),
          ('Platelių ežeras', 2599.0, 47.0),
          ('Dysnų ežeras', 0.45, 8.6),
          ('Drūkšiai', 44.6, 33.3);`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}

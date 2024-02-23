import { MigrationInterface, QueryRunner } from "typeorm";

export class Cpmigracija1710785376460 implements MigrationInterface {
    name = 'Cpmigracija1710785376460'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "lake" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "area" numeric(10,2) NOT NULL, "depth" numeric(10,2) NOT NULL, CONSTRAINT "PK_ad13ad710cd5e24100384e50994" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "lake"`);
    }

}

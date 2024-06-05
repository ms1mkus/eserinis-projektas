import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLakesAndUser1711204980662 implements MigrationInterface {
    name = 'AddLakesAndUser1711204980662'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "username" character varying(20) NOT NULL, "email" character varying(255) NOT NULL, "hashPassword" character varying NOT NULL, "salt" character varying NOT NULL, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "lake" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "area" numeric(10,2) NOT NULL, "depth" numeric(10,2) NOT NULL, "description" character varying(100) NOT NULL, "location" geography(Point,4326), CONSTRAINT "PK_ad13ad710cd5e24100384e50994" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e9f7ac0446d3916c5903b2ed67" ON "lake" USING GiST ("location") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_e9f7ac0446d3916c5903b2ed67"`);
        await queryRunner.query(`DROP TABLE "lake"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}

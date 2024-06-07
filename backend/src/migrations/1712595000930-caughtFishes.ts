import { MigrationInterface, QueryRunner } from "typeorm";

export class CaughtFishes1712595000930 implements MigrationInterface {
    name = 'CaughtFishes1712595000930'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "fish" ("id" SERIAL NOT NULL, "description" character varying(100) NOT NULL, "name" character varying(100) NOT NULL, CONSTRAINT "PK_6ffb9180fd59d279a93e2a6f786" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "lake" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "area" numeric(10,2) NOT NULL, "depth" numeric(10,2) NOT NULL, "description" character varying(100) NOT NULL, "location" geography(Point,4326), CONSTRAINT "PK_ad13ad710cd5e24100384e50994" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e9f7ac0446d3916c5903b2ed67" ON "lake" USING GiST ("location") `);
        await queryRunner.query(`CREATE TABLE "caught_fish" ("id" SERIAL NOT NULL, "caughtAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "fishId" integer, "lakeId" integer, CONSTRAINT "PK_e738485f7099653515fc6c5d198" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "username" character varying(20) NOT NULL, "email" character varying(255) NOT NULL, "hashPassword" character varying NOT NULL, "salt" character varying NOT NULL, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "caught_fish" ADD CONSTRAINT "FK_914a29df905cbe003838abceae5" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "caught_fish" ADD CONSTRAINT "FK_c3fc6ee6e55953b13e15004aab9" FOREIGN KEY ("fishId") REFERENCES "fish"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "caught_fish" ADD CONSTRAINT "FK_3be0e8c25516442d74d671931aa" FOREIGN KEY ("lakeId") REFERENCES "lake"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "caught_fish" DROP CONSTRAINT "FK_3be0e8c25516442d74d671931aa"`);
        await queryRunner.query(`ALTER TABLE "caught_fish" DROP CONSTRAINT "FK_c3fc6ee6e55953b13e15004aab9"`);
        await queryRunner.query(`ALTER TABLE "caught_fish" DROP CONSTRAINT "FK_914a29df905cbe003838abceae5"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "caught_fish"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e9f7ac0446d3916c5903b2ed67"`);
        await queryRunner.query(`DROP TABLE "lake"`);
        await queryRunner.query(`DROP TABLE "fish"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImageToUser1713819813644 implements MigrationInterface {
    name = 'AddImageToUser1713819813644'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "imageBlob" bytea`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "imageBlob"`);
    }

}

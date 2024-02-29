import { MigrationInterface, QueryRunner } from "typeorm";

export class PopulateLakes1712605772362 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO "lake" ("name", "area", "depth", "description", "location") 
        VALUES
        ('Kauno marios', 47.5, 22, 'Didžiausias dirbtinis vandens telkinys Lietuvoje', ST_GeographyFromText('SRID=4326;POINT(24.126395 54.866802)')),
        ('Lampėdžių karjeras', 1.28, 11, 'Karjeras', ST_GeographyFromText('SRID=4326;POINT(23.811637 54.916349)')),
        ('Graužės I tvenkinys', 0.01, 1, 'Graužės I tvenkinys', ST_GeographyFromText('SRID=4326;POINT(23.824353 54.883869)')),
        ('Graužės II tvenkinys', 0.03, 9, 'Graužės II tvenkinys', ST_GeographyFromText('SRID=4326;POINT(23.831667 54.885435)')),
        ('Graužės III tvenkinys', 0.03, 3, 'Graužės III tvenkinys', ST_GeographyFromText('SRID=4326;POINT(23.837287 54.887696)')),
        ('Graužės IV tvenkinys', 0.04, 4, 'Graužės IV tvenkinys', ST_GeographyFromText('SRID=4326;POINT(23.844238 54.889662)')),
        ('Graužės V tvenkinys', 0.04, 5, 'Graužės V tvenkinys', ST_GeographyFromText('SRID=4326;POINT(23.841016 54.889805)')),
        ('Neveronių I tvenkinys', 0.04, 1, 'Neveronių I tvenkinys', ST_GeographyFromText('SRID=4326;POINT(24.11271 54.933043)')),
        ('Neveronių II tvenkinys', 0.06, 2, 'Neveronių II tvenkinys', ST_GeographyFromText('SRID=4326;POINT(24.116788 54.935601)')),
        ('Garliavos I tvenkinys', 0.05, 3.6, 'Garliavos I tvenkinys', ST_GeographyFromText('SRID=4326;POINT(23.891429 54.825523)'))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}

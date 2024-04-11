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
        ('Povilas', 47.5, 22, 'Didžiausias dirbtinis Povilas Lietuvoje', ST_GeographyFromText('SRID=4326;POINT(23.930605965272406 54.85293996735887)')),
        ('Garliavos I tvenkinys', 0.05, 3.6, 'Garliavos I tvenkinys', ST_GeographyFromText('SRID=4326;POINT(23.891429 54.825523)'))`,
        ('Gėsalų tvenkinys', 1.28, 11, 'Gėsalų tvenkinys', ST_GeographyFromText('SRID=4326;POINT(56.30641370285717, 21.770900135524478)')),
        ('Kalnėnų tvenkinys', 1.28, 11, 'Karjeras', ST_GeographyFromText('SRID=4326;POINT(56.29232332331496, 21.811922106702085)')),
        ('Laukžemių tvenkinys', 1.28, 11, 'Karjeras', ST_GeographyFromText('SRID=4326;POINT(55.79195826119552, 21.183519787611147)')),
        ('Balsupių tvenkinys', 1.28, 11, 'Karjeras', ST_GeographyFromText('SRID=4326;POINT(54.556472920385936, 23.1845075149709)')),
        ('Birutos tvenkinys', 1.28, 11, 'Karjeras', ST_GeographyFromText('SRID=4326;POINT(54.36088067975854, 23.486401284828446)')),
        ('Vijūnėlės tvenkinys', 1.28, 11, 'Karjeras', ST_GeographyFromText('SRID=4326;POINT(54.01620153413977, 23.962647603635126)')),
        ('Druskonis', 1.28, 11, 'Karjeras', ST_GeographyFromText('SRID=4326;POINT(54.01487687592944, 23.972916922769123)')),
        ('Grybaulios tvenkinys', 1.28, 11, 'Karjeras', ST_GeographyFromText('SRID=4326;POINT(54.01337395100741, 24.365610872358392)')),
        ('Margėjų tvenkinys', 1.28, 11, 'Karjeras', ST_GeographyFromText('SRID=4326;POINT(54.659662578509646, 25.67858399547029)')),
        ('Vijūnėlės tvenkinys', 1.28, 11, 'Karjeras', ST_GeographyFromText('SRID=4326;POINT(54.01620153413977, 23.962647603635126)')),
        ('Kupiškio tvenkinys', 1.28, 11, 'Karjeras', ST_GeographyFromText('SRID=4326;POINT(55.91183533277257, 25.024002296070186)')),
        ('Beičių tvenkinys', 1.28, 11, 'Karjeras', ST_GeographyFromText('SRID=4326;POINT(55.839083591691114, 25.661864646273507)')),
        ('Baltausių tvenkinys', 1.28, 11, 'Karjeras', ST_GeographyFromText('SRID=4326;POINT(56.293709543379585, 23.991647821305715)')),
        ('Drąsutačių tvenkinys', 1.28, 11, 'Karjeras', ST_GeographyFromText('SRID=4326;POINT(56.35337755943875, 23.74735924223739)')),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}

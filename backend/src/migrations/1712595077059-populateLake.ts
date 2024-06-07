import { MigrationInterface, QueryRunner } from "typeorm";

export class PopulateLake1712595077059 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO "lake" ("name", "area", "depth", "description", "location") 
            VALUES
            ('Dysnai ežeras', 10.5, 15.0, 'Didžiausias ežeras Lietuvoje', ST_GeographyFromText('SRID=4326;POINT(26.337609 55.491291)')),
            ('Tauragnų ežeras', 8.2, 12.5, 'Populiarus žvejybos spotas', ST_GeographyFromText('SRID=4326;POINT(25.881961 55.449242)')),
            ('Asvejos ežeras', 5.0, 10.0, 'Žinomas dėl skaidrių vandenų', ST_GeographyFromText('SRID=4326;POINT(25.506353 55.043177)')),
            ('Drūkšių ežeras', 44.8, 33.2, 'Antras pagal dydį Lietuvos ežeras', ST_GeographyFromText('SRID=4326;POINT(26.594697 55.627766)')),
            ('Platelių ežeras', 12.05, 50.8, 'Giliausias ežeras Lietuvoje', ST_GeographyFromText('SRID=4326;POINT(21.854692 56.042862)')),
            ('Zarasų ežeras', 15.4, 19.0, 'Garsėja giliais vandenimis', ST_GeographyFromText('SRID=4326;POINT(21.856656 56.041501)')),
            ('Širvėnos ežeras', 1.0, 9.0, 'Mažas, bet gražus ežeras', ST_GeographyFromText('SRID=4326;POINT(24.753694 56.213707)')),
            ('Metelys', 3.0, 7.0, 'Lakštingalų ežeras', ST_GeographyFromText('SRID=4326;POINT(23.771415 54.296179)')),
            ('Bebrusai', 0.5, 2.5, 'Bebrų koncentracijos epicentras', ST_GeographyFromText('SRID=4326;POINT(25.461473 55.189192)')),
            ('Alksnaitis', 0.3, 2.0, 'Mažas, bet jaukus ežeras', ST_GeographyFromText('SRID=4326;POINT(25.991041 55.352488)')),
            ('Ešerinis', 2.2, 4.7, 'Suformuotas po ledu', ST_GeographyFromText('SRID=4326;POINT(25.914959 55.315593)')),
            ('Sartai', 6.8, 12.0, 'Gyvenamoji vietovė ežero krantuose', ST_GeographyFromText('SRID=4326;POINT(25.831941 55.819333)')),
            ('Kretuonas', 1.1, 7.6, 'Nuo vėjo apsaugotas', ST_GeographyFromText('SRID=4326;POINT(26.080303 55.252214)')),
            ('Gilužis', 1.2, 3.5, 'Populiarus laisvalaikio praleidimo objektas', ST_GeographyFromText('SRID=4326;POINT(25.550090 55.309473)')),
            ('Lukštas', 0.7, 4.1, 'Suformuotas po ledo', ST_GeographyFromText('SRID=4326;POINT(25.277746 55.380079)'));`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}

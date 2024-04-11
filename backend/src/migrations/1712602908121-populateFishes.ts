import { MigrationInterface, QueryRunner } from "typeorm";

export class PopulateFishes1712602908121 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    `INSERT INTO fish (name, description) VALUES ('Ešerys', 'Ešerys yra populiari žuvis Lietuvoje.');
        INSERT INTO fish (name, description) VALUES ('Lydeka', 'Lydeka yra viena iš dažniausiai žvejotų žuvų.');
        INSERT INTO fish (name, description) VALUES ('Karšis', 'Karšis yra didelė ir mėsinga žuvis.');
        INSERT INTO fish (name, description) VALUES ('Upėtakis', 'Upėtakis yra maža, bet skanu žuvis.');
        INSERT INTO fish (name, description) VALUES ('Šamas', 'Šamas yra gausiai randama ežeruose ir upėse.');`;
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}

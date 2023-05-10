import { MigrationInterface, QueryRunner } from 'typeorm';

export class createTableMessages1636422912928 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS messages
        (
            id serial NOT NULL PRIMARY KEY,
            success boolean NOT NULL DEFAULT FALSE,
            client_code varchar(15) NOT NULL,
            status varchar(3) NOT NULL,
            message varchar(255) NOT NULL,
            language varchar(8) NOT NULL,
            error_server_code varchar(100) NULL,
            error_detail text NULL,
            created_at timestamp NOT NULL DEFAULT NOW(),
            created_by int8 NOT NULL DEFAULT 0,
            updated_at timestamp NULL,
            updated_by int8 NULL,
            CONSTRAINT messages_client_code_lang_err_server_code_unique unique (client_code, language, error_server_code)
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE messages');
  }
}

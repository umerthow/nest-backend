import { MigrationInterface, QueryRunner } from 'typeorm';

export class seedMessageInit1636423533847 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO messages (success, client_code, status, message, language, error_server_code) VALUES
        (true, 'INF-2000', '200', 'Success', 'en', null),
        (true, 'INF-2000', '200', 'Sukses', 'id', null),
        (true, 'INF-2001', '200', 'Add data Success', 'en', null),
        (true, 'INF-2001', '200', 'Sukses menambahkan data', 'id', null),
        (true, 'INF-2002', '200', 'Update data Success', 'en', null),
        (true, 'INF-2002', '200', 'Sukses perbarui data', 'id', null),
        (true, 'INF-2003', '200', 'Delete data Success', 'en', null),
        (true, 'INF-2003', '200', 'Sukses hapus data', 'id', null),
        (false, 'ERR-4001', '400', 'Add {name} failed', 'en', null),
        (false, 'ERR-4001', '400', 'Tambah {name} gagal', 'id', null),
        (false, 'ERR-4002', '400', 'Update {name} failed', 'en', null),
        (false, 'ERR-4002', '400', 'Perbarui {name} gagal', 'id', null),
        (false, 'ERR-4003', '400', 'Delete {name} failed', 'en', null),
        (false, 'ERR-4003', '400', 'Hapus {name} gagal', 'id', null),
        (false, 'ERR-4010', '401', 'Login Failed', 'en', null),
        (false, 'ERR-4010', '401', 'Login gagal', 'id', null),
        (false, 'ERR-4011', '401', 'Token Payload Invalid', 'en', null),
        (false, 'ERR-4011', '401', 'Token data tidak valid', 'id', null),
        (false, 'ERR-4012', '401', 'Invalid Token', 'en', null),
        (false, 'ERR-4012', '401', 'Token tidak valid', 'id', null),
        (false, 'ERR-4040', '404', 'Data {name} not found', 'en', null),
        (false, 'ERR-4040', '404', 'Data {name} tidak ditemukan', 'id', null),
        (false, 'ERR-4060', '406', 'Field {name} is required', 'en', 'isNotEmpty'),
        (false, 'ERR-4060', '406', 'Input {name} harus diisi', 'id', 'isNotEmpty'),
        (false, 'ERR-4060', '406', 'Field {name} must a string', 'en', 'isString'),
        (false, 'ERR-4060', '406', 'Input {name} harus berupa text', 'id', 'isString'),
        (false, 'ERR-4060', '406', 'Field {name} must a boolean', 'en', 'isBoolean'),
        (false, 'ERR-4060', '406', 'Input {name} harus berupa boolean', 'id', 'isBoolean'),
        (false, 'ERR-4060', '406', 'Field {name} is not allowed', 'en', 'whitelistValidation'),
        (false, 'ERR-4060', '406', 'Input {name} tidak diperbolehkan', 'id', 'whitelistValidation'),
        (false, 'ERR-4070', '406', 'Field {name} must a number', 'en', 'isInt'),
        (false, 'ERR-4070', '406', 'Input {name} harus berupa digit nomor', 'id', 'isInt'),
        (false, 'ERR-4060', '406', 'Field {name} must a number', 'en', 'isNumber'),
        (false, 'ERR-4060', '406', 'Input {name} harus berupa digit nomor', 'id', 'isNumber'),
        (false, 'ERR-5000', '500', 'CORS Origin Error', 'en', null),
        (false, 'ERR-5000', '500', 'Terjadi kesalahan pada CORS', 'id', null)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM messages');
  }
}

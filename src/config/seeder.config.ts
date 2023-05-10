/* eslint-disable import/no-import-module-exports */
import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';
import EnvironmentConfig from './environment.config';

ConfigModule.forRoot();
const environment = EnvironmentConfig();

export default new DataSource({
  type: 'postgres',
  host: environment.dbUser.master.host,
  port: environment.dbUser.master.port,
  username: environment.dbUser.master.username,
  password: environment.dbUser.master.password,
  database: environment.dbUser.master.database,
  migrations: ['seeders/*.ts']
});

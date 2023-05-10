import path from 'path';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Injectable()
export default class TypeormFactoryProvider implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {
    this.configService = configService;
  }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const { configService } = this;
    return {
      type: 'postgres',
      username: configService.get('dbUser.username'),
      password: configService.get('dbUser.password'),
      database: configService.get('dbUser.database'),
      entities: [path.join(__dirname, '../../models/entities/*.entity{.ts,.js}')],
      logging: configService.get('isDevelopment') ? 'all' : ['query', 'error'],
      replication: {
        master: {
          host: configService.get('dbUser.master.host'),
          port: configService.get('dbUser.master.port'),
          username: configService.get('dbUser.master.username'),
          password: configService.get('dbUser.master.password'),
          database: configService.get('dbUser.master.database')
        },
        slaves: [
          {
            host: configService.get('dbUser.slave.host'),
            port: configService.get('dbUser.slave.port'),
            username: configService.get('dbUser.slave.username'),
            password: configService.get('dbUser.slave.password'),
            database: configService.get('dbUser.slave.database')
          }
        ]
      },
      namingStrategy: new SnakeNamingStrategy()
    };
  }
}

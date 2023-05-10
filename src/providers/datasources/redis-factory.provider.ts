import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisModuleOptions, RedisOptionsFactory } from '@liaoliaots/nestjs-redis';

@Injectable()
export default class RedisFactoryProvider implements RedisOptionsFactory {
  constructor(private readonly configService: ConfigService) {
    this.configService = configService;
  }

  createRedisOptions(): RedisModuleOptions {
    const { configService } = this;
    return {
      readyLog: true,
      commonOptions: {
        host: configService.get('redis.host'),
        port: configService.get('redis.port'),
        password: configService.get('redis.password'),
        connectTimeout: configService.get('redis.timeout')
      },
      config: [
        {
          db: configService.get('isTargetProduction') ? 0 : 10,
          keyPrefix: configService.get('isTargetProduction') ? 'session:' : `session_${process.env.TARGET_ENV}:`
        },
        {
          namespace: 'MESSAGES',
          db: 2,
          keyPrefix: 'messages:'
        }
      ]
    };
  }
}

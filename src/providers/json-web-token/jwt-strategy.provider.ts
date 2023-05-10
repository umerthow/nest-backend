import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import Redis from 'ioredis';
import { DEFAULT_REDIS_NAMESPACE, InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUserJWTPayload } from '@interfaces/user/iuser.interface';

@Injectable()
export class JwtStrategyProvider extends PassportStrategy(Strategy) {
  constructor(
    @InjectRedis(DEFAULT_REDIS_NAMESPACE) private readonly redisService: Redis,
    configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader('x-access-token'),
      secretOrKey: configService.get('secretKeyAuth')
    });
    this.redisService = redisService;
  }

  async validate(payload: Exclude<IUserJWTPayload, 'code'>) {
    const getRedisValue = await this.redisService.get(payload.id.toString());

    if (!getRedisValue) {
      return null;
    }

    const parseValue = JSON.parse(getRedisValue || '{}');
    return {
      ...payload,
      userAccountId: parseValue?.id
    };
  }
}

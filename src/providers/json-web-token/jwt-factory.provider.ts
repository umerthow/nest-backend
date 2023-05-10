import { Injectable } from '@nestjs/common';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export default class JwtFactoryProvider implements JwtOptionsFactory {
  constructor(private readonly configService: ConfigService) {
    this.configService = configService;
  }

  createJwtOptions(): JwtModuleOptions {
    const { configService } = this;
    return {
      secret: configService.get('secretKeyAuth'),
      signOptions: {
        expiresIn: configService.get('jwtExpired')
      }
    };
  }
}

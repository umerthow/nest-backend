import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { HealthModule } from '@modules/health/health.module';
import FilterModule from '@filters/index.module';
import TypeormFactoryProvider from '@providers/datasources/typeorm-factory.provider';
import RedisFactoryProvider from '@providers/datasources/redis-factory.provider';
import EnvironmentConfig from '@config/environment.config';
import JwtFactoryProvider from '@providers/json-web-token/jwt-factory.provider';
import { JwtStrategyProvider } from '@providers/json-web-token/jwt-strategy.provider';
import ResolverMiddleware from '@middlewares/resolver.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvironmentConfig],
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      name: 'default',
      useClass: TypeormFactoryProvider
    }),
    {
      ...JwtModule.registerAsync({
        useClass: JwtFactoryProvider
      }),
      global: true
    },
    RedisModule.forRootAsync({
      useClass: RedisFactoryProvider
    }),
    FilterModule,
    HealthModule
  ],
  providers: [JwtStrategyProvider]
})
export default class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(ResolverMiddleware).forRoutes('*');
  }
}

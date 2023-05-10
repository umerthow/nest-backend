import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from '@modules/health/health.module';
import FilterModule from '@filters/index.module';
import EnvironmentConfig from '@config/environment.config';
import { UserModule } from '@modules/user/user.module';
import ResolverMiddleware from '@middlewares/resolver.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvironmentConfig],
      isGlobal: true
    }),
    FilterModule,
    HealthModule,
    UserModule
  ],
})
export default class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(ResolverMiddleware).forRoutes('*');
  }
}

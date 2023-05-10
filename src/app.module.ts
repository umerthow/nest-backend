import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from '@modules/health/health.module';
import FilterModule from '@filters/index.module';
import TypeormFactoryProvider from '@providers/datasources/typeorm-factory.provider';
import EnvironmentConfig from '@config/environment.config';
import { UserModule } from '@modules/user/user.module';
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

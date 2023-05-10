import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesEntity } from '@models/entities/messages.entity';
import { ExceptionsFilter } from './exceptions.filter';
import { HttpExceptionFilter } from './http-exception.filter';

@Module({
  imports: [TypeOrmModule.forFeature([MessagesEntity])],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ExceptionsFilter
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    }
  ]
})
export default class FilterModule {}

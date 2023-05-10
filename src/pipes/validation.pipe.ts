import { PipeTransform, ArgumentMetadata, NotAcceptableException, Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ValidationPipeOptions } from '@nestjs/common/pipes/validation.pipe';
import { ERROR } from 'constants/client-code.constant';

@Injectable()
export class ValidationPipe implements PipeTransform {
  private readonly isTransformEnabled: boolean;

  private readonly isWhitelist;

  private readonly isForbidWhitelist;

  constructor(options?: ValidationPipeOptions) {
    this.isTransformEnabled = options?.transform || false;
    this.isWhitelist = options?.whitelist || false;
    this.isForbidWhitelist = options?.forbidNonWhitelisted || false;
  }

  async transform(value: Record<string, unknown>, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object, {
      whitelist: this.isWhitelist,
      forbidNonWhitelisted: this.isForbidWhitelist
    });
    if (errors.length > 0) {
      throw new NotAcceptableException({
        clientCode: ERROR.VALIDATION,
        type: 'ValidationException',
        defaultDetail: errors.map((item: Record<string, any>) => ({
          type: Object.keys(item.constraints)[0],
          field: item.property
        }))
      });
    }
    return this.isTransformEnabled ? object : value;
  }

  private toValidate(metaType: ReturnType<any>): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metaType);
  }
}

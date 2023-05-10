import { ArgumentMetadata, Injectable, NotAcceptableException, PipeTransform } from '@nestjs/common';
import { ERROR } from 'constants/client-code.constant';

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, { data: paramKey }: ArgumentMetadata): number {
    const val = parseInt(value, 10);
    if (Number.isNaN(val)) {
      throw new NotAcceptableException({
        clientCode: ERROR.VALIDATION,
        type: 'ParseIntException',
        defaultDetail: [
          {
            type: 'IsInt',
            field: paramKey
          }
        ]
      });
    }
    return val;
  }
}

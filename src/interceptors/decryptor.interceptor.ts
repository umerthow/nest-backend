import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ENCRYPTED_FIELD_LIST } from '@constants/crypto.constants';
import { decryptKey } from '@utils/transform.util';

@Injectable()
export class DecryptorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { body, query, params } = context.switchToHttp().getRequest();
    const bodyKey = Object.keys(body);
    const paramsKey = Object.keys(params);
    const queryKey = Object.keys(query);
    bodyKey.forEach((key) => {
      if (ENCRYPTED_FIELD_LIST.indexOf(key) >= 0) {
        body[key] = decryptKey(body[key]);
      }
    });

    paramsKey.forEach((key) => {
      if (ENCRYPTED_FIELD_LIST.indexOf(key) >= 0) {
        params[key] = decryptKey(params[key]);
      }
    });

    queryKey.forEach((key) => {
      if (ENCRYPTED_FIELD_LIST.indexOf(key) >= 0) {
        query[key] = decryptKey(query[key]);
      }
    });
    return next.handle();
  }
}

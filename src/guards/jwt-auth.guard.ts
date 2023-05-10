import { ArgumentsHost, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { assign, startCase, isEmpty } from 'lodash';
import { Observable } from 'rxjs';
import { ERROR } from '@constants/client-code.constant';
import { IUserJWTPayload } from '@interfaces/user/iuser.interface';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest(
    _: null,
    user: (IUserJWTPayload & { userAccountId: number }) | null,
    info: Record<'message', undefined | string>,
    context: ArgumentsHost
  ): any {
    const req = context.switchToHttp().getRequest();
    const errorType = startCase(info?.message).replace(/ /g, '');
    if (errorType) {
      throw new UnauthorizedException({
        clientCode: ERROR.JWT_INVALID,
        type: errorType
      });
    }

    if (!user) {
      throw new UnauthorizedException({
        clientCode: ERROR.UNAUTHORIZED_LOGIN
      });
    }

    const { id, userAccountId } = user;
    if (!id || !userAccountId) {
      throw new UnauthorizedException({
        clientCode: ERROR.JWT_PAYLOAD_INVALID
      });
    }
    if (!isEmpty(req.body)) {
      req.body = this.bodyResolver(req.body, user.userAccountId);
    }
    return user;
  }

  private bodyResolver(body: Record<string, unknown>, userAccountId: number) {
    return assign(body, { userAccountId });
  }
}

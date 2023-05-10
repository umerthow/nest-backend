import { IncomingHttpHeaders } from 'http';
import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { parseAcceptLanguageHeader, parseRequestID } from '@utils/parse.util';

@Injectable()
export default class ResolverMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    this.headerResolver(req.headers);
    this.requestResolver(req, res);
    this.bodyResolver(req);
    next();
  }

  private headerResolver(headers: IncomingHttpHeaders): void {
    Object.assign(headers, {
      'accept-language': parseAcceptLanguageHeader(headers['accept-language'])
    });
  }

  private requestResolver(req: Request, res: Response): void {
    const requestId = parseRequestID(req.headers);
    Object.assign(req, { requestId });
    res.setHeader('X-Request-Id', requestId);
  }

  private bodyResolver(req: Request): void {
    Object.assign(req, { body: req.body });
  }
}

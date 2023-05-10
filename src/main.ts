import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import compression from 'compression';
import publicIp from 'public-ip';
import requestIp from 'request-ip';
import { HttpStatus, InternalServerErrorException, Logger, VersioningType } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { ERROR } from '@constants/client-code.constant';
import httpRequestLoggerMiddleware from '@middlewares/http-request-logger.middleware';
import { networkInterfaces } from 'os';
import AppModule from './app.module';

function getPrivateIP() {
  const nets = networkInterfaces();
  const results = Object.create({});
  Object.keys(nets).forEach((name) => {
    nets[name]?.forEach((net) => {
      if (net.family === 'IPv4' && !net.internal) {
        if (!results[name]) {
          results[name] = [];
        }
        results[name].push(net.address);
      }
    });
  });
  return results;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = process.env.PORT || 3000;

  const corsOptions = {
    origin(requestOrigin: string, callback: (err: Error | null, isPass?: boolean) => void) {
      if (configService.get('whiteListedOrigin').split(',').indexOf(requestOrigin) !== -1) {
        callback(null, true);
      } else {
        callback(
          new InternalServerErrorException({
            clientCode: ERROR.CORS_ERROR
          })
        );
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    optionsSuccessStatus: 204,
    credentials: true,
    exposedHeaders: ['Language']
  };

  // middleware express
  app.use(helmet());
  app.use(compression());
  app.use(httpRequestLoggerMiddleware);
  app.use(requestIp.mw());
  app.use('/', (req: Request, res: Response, next: NextFunction) => {
    if (req.originalUrl === '/') {
      return res.status(HttpStatus.OK).send('OK');
    }
    return next();
  });

  if (configService.get('isProduction')) {
    app.useLogger(console);
  }

  app.enableVersioning({
    type: VersioningType.URI
  });
  app.setGlobalPrefix('boilerplate');
  app.enableCors(corsOptions);
  await app.listen(port, async () => {
    Logger.log(`🚀 Server is Running on: ${await app.getUrl()}`);
  });
  Logger.log(`IP Private: ${JSON.stringify(getPrivateIP())}`);
  Logger.log(`IP Server: ${await publicIp.v4()}`);
}

void bootstrap();

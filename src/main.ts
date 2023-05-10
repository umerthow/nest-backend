import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import compression from 'compression';
import publicIp from 'public-ip';
import requestIp from 'request-ip';
import { HttpStatus, Logger, VersioningType } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import httpRequestLoggerMiddleware from '@middlewares/http-request-logger.middleware';
import { networkInterfaces } from 'os';
import AppModule from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

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
  app.setGlobalPrefix('sunbytes');

  const config = new DocumentBuilder()
    .setTitle('Api example')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('Sunbytes')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port, async () => {
    Logger.log(`🚀 Server is Running on: ${await app.getUrl()}`);
  });
  Logger.log(`IP Private: ${JSON.stringify(getPrivateIP())}`);
  Logger.log(`IP Server: ${await publicIp.v4()}`);
}

void bootstrap();

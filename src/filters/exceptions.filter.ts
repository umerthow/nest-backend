import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Injectable } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import stringTemplate from 'string-template';
import { Response } from 'express';
import { MessagesEntity } from '@models/entities/messages.entity';
import { IResponseError, IResponseErrorException } from '@interfaces/common/iresponse-api.interface';
import { responseApiErrorUtil } from '@utils/response-api.util';
import { getMessageValue } from '@utils/message.util';
import { parseAcceptLanguageHeader } from '@utils/parse.util';

@Injectable()
@Catch()
export class ExceptionsFilter extends BaseExceptionFilter implements ExceptionFilter {
  constructor(
    @InjectRedis('MESSAGES') private readonly redisService: Redis,
    @InjectRepository(MessagesEntity)
    private readonly messageRepository: Repository<MessagesEntity>
  ) {
    super();
    this.redisService = redisService;
    this.messageRepository = messageRepository;
  }

  async catch(
    exception: IResponseErrorException,
    host: ArgumentsHost
  ): Promise<Promise<IResponseError> | Response<IResponseError>> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const { headers } = ctx.getRequest();

    const { code, name, message, stack, detail: description } = exception;
    console.error(message, stack);

    const getMessage = await getMessageValue({
      clientCode: code,
      language: parseAcceptLanguageHeader(headers['accept-language']),
      redisService: this.redisService,
      messageRepository: this.messageRepository,
      errorServerCode: name
    });

    const status = Number(getMessage?.status) || HttpStatus.INTERNAL_SERVER_ERROR;

    return responseApiErrorUtil(response, {
      success: false,
      status,
      message: getMessage?.message ? stringTemplate(getMessage.message, { name }) : message,
      type: name,
      errDescription: getMessage?.message || description,
      errDetail: {
        code,
        message,
        stack
      }
    });
  }
}

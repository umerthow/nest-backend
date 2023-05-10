import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { Repository } from 'typeorm';
import stringTemplate from 'string-template';
import { Response } from 'express';
import {
  IResponseError,
  IResponseErrorHttp,
  IResponseValidationError
} from '@interfaces/common/iresponse-api.interface';
import { MessagesEntity } from '@models/entities/messages.entity';
import { ERROR } from '@constants/client-code.constant';
import { responseApiErrorUtil } from '@utils/response-api.util';
import { getMessageValue } from '@utils/message.util';
import { parseAcceptLanguageHeader } from '@utils/parse.util';

@Injectable()
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    @InjectRedis('MESSAGES') private readonly redisService: Redis,
    @InjectRepository(MessagesEntity)
    private readonly messageRepository: Repository<MessagesEntity>
  ) {
    this.redisService = redisService;
    this.messageRepository = messageRepository;
  }

  async catch(
    exception: HttpException,
    host: ArgumentsHost
  ): Promise<Promise<IResponseError> | Response<IResponseError>> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const { headers } = ctx.getRequest();
    const errResponse: any = exception.getResponse();

    const {
      clientCode,
      type,
      defaultDetail,
      name,
      redirectUrl,
      isShowLogErrorHttpService,
      exceptionError
    }: IResponseErrorHttp = errResponse;

    if (isShowLogErrorHttpService && exceptionError) {
      Logger.error(`Error Status ${exceptionError.response?.status}: ${exceptionError.response?.data}`);
    } else if (exceptionError) {
      Logger.error(`${exceptionError.message}: ${exceptionError.stack}`);
    }

    const isErrorValidation = clientCode === ERROR.VALIDATION;

    const getMessage = await getMessageValue({
      clientCode,
      language: parseAcceptLanguageHeader(headers['accept-language']),
      redisService: this.redisService,
      messageRepository: this.messageRepository,
      type,
      isErrorValidation
    });

    let customDetail;
    if (isErrorValidation) {
      customDetail = await this.getResponseValidation(
        clientCode,
        parseAcceptLanguageHeader(headers['accept-language']),
        defaultDetail
      );
    }

    const status = Number(getMessage?.status) || exception.getStatus();
    const { name: errorType, message } = exception;

    const details = {
      success: getMessage?.success || false,
      status,
      clientCode,
      message: getMessage?.message
        ? stringTemplate(getMessage.message, { name: isErrorValidation ? '*' : name })
        : message,
      type: type || errorType,
      errDetail: customDetail || defaultDetail
    };

    if (redirectUrl) {
      return response.redirect(`${redirectUrl}?error=${JSON.stringify(details)}`);
    }

    return responseApiErrorUtil(response, details);
  }

  async getResponseValidation(
    clientCode: string,
    language: string,
    defaultDetail: IResponseValidationError | IResponseValidationError[] | undefined
  ): Promise<Promise<IResponseValidationError[]> | Record<string, unknown>[]> {
    return Promise.all(
      Array.isArray(defaultDetail)
        ? defaultDetail.map(async (item: IResponseValidationError) => {
            const { field, type } = item;
            const getMessage = await this.messageRepository.findOne({
              where: {
                clientCode,
                errorServerCode: type,
                language
              }
            });
            return {
              field,
              message: getMessage?.message ? stringTemplate(getMessage.message, { name: field }) : ''
            };
          })
        : []
    );
  }
}

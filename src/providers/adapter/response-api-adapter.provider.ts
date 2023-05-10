import { Repository } from 'typeorm';
import { Response, Request } from 'express';
import Redis from 'ioredis';
import { HttpStatus } from '@nestjs/common';
import { getReasonPhrase } from 'http-status-codes';
import stringTemplate from 'string-template';
import { responseApiUtil } from '@utils/response-api.util';
import { MessagesEntity } from '@models/entities/messages.entity';
import { IResponseBase } from '@interfaces/common/iresponse-api.interface';
import { getMessageValue } from '@utils/message.util';
import { parseAcceptLanguageHeader } from '@utils/parse.util';

interface IDetails {
  clientCode?: string;
  data?: Record<string, any>;
  additionalResponse?: Record<string, any>;
  name?: string;
  redirectUrl?: string;
}

export default abstract class ResponseApiServiceAdapterProvider {
  protected constructor(private readonly repository: Repository<MessagesEntity>, private readonly redisService: Redis) {
    this.redisService = redisService;
  }

  async send(req: Request, res: Response, details: IDetails): Promise<Response<IResponseBase> | any> {
    const { data, clientCode, additionalResponse, name, redirectUrl } = details;

    const getMessage = await getMessageValue({
      clientCode,
      language: parseAcceptLanguageHeader(req.headers['accept-language']),
      redisService: this.redisService,
      messageRepository: this.repository
    });

    const status = Number(getMessage?.status) || HttpStatus.BAD_REQUEST;
    const message = getMessage?.message ? stringTemplate(getMessage.message, { name }) : getReasonPhrase(status);

    if (redirectUrl) {
      return res.redirect(redirectUrl);
    }

    return responseApiUtil(res, {
      success: getMessage?.success || false,
      clientCode: clientCode || '',
      status,
      message,
      data,
      additionalResponse
    });
  }
}

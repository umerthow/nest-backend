import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Injectable } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';
import { IResponseError, IResponseErrorException } from '@interfaces/common/iresponse-api.interface';
import { responseApiErrorUtil } from '@utils/response-api.util';
@Injectable()
@Catch()
export class ExceptionsFilter extends BaseExceptionFilter implements ExceptionFilter {
  constructor() {
    super();
  }

  async catch(
    exception: IResponseErrorException,
    host: ArgumentsHost
  ): Promise<Promise<IResponseError> | Response<IResponseError>> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const { code, name, message, stack, detail: description } = exception;
    console.error(message, stack);

    const status = HttpStatus.INTERNAL_SERVER_ERROR;

    return responseApiErrorUtil(response, {
      success: false,
      status,
      message: message,
      type: name,
      errDescription: description,
      errDetail: {
        code,
        message,
        stack
      }
    });
  }
}

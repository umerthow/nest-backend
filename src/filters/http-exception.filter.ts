import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Injectable, Logger } from '@nestjs/common';
import { Response } from 'express';
import {
  IResponseError,
  IResponseErrorHttp,
  IResponseValidationError
} from '@interfaces/common/iresponse-api.interface';
import { responseApiErrorUtil } from '@utils/response-api.util';
import { jsonToString } from '@utils/parse.util';
@Injectable()
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor() {
  }

  async catch(
    exception: HttpException,
    host: ArgumentsHost
  ): Promise<Promise<IResponseError> | Response<IResponseError>> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const errResponse: any = exception.getResponse();

    
    const {
      clientCode,
      type,
      defaultDetail,
      redirectUrl,
      isShowLogErrorHttpService,
      exceptionError
    }: IResponseErrorHttp = errResponse;

    Logger.error(`Error: ${jsonToString(errResponse)}`);

    if (isShowLogErrorHttpService && exceptionError) {
      Logger.error(`Error Status ${exceptionError.response?.status}: ${exceptionError.response?.data}`);
    } else if (exceptionError) {
      Logger.error(`${exceptionError.message}: ${exceptionError.stack}`);
    }
    const status = exception.getStatus();
    const { name: errorType, message } = exception;

    const details = {
      success: false,
      status,
      clientCode,
      message,
      type: type || errorType,
      errDetail: defaultDetail
    };

    if (redirectUrl) {
      return response.redirect(`${redirectUrl}?error=${JSON.stringify(details)}`);
    }

    return responseApiErrorUtil(response, details);
  }

  async getResponseValidation(
    defaultDetail: IResponseValidationError | IResponseValidationError[] | undefined
  ): Promise<Promise<IResponseValidationError[]> | Record<string, unknown>[]> {
    return Promise.all(
      Array.isArray(defaultDetail)
        ? defaultDetail.map(async (item: IResponseValidationError) => {
            const { field, type } = item;
            return {
              field,
              message: type
            };
          })
        : []
    );
  }
}

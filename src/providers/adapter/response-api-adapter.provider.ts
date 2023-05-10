import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';
import { responseApiUtil } from '@utils/response-api.util';
import { IResponseBase } from '@interfaces/common/iresponse-api.interface';

interface IDetails {
  clientCode?: string;
  data?: Record<string, any>;
  additionalResponse?: Record<string, any>;
  name?: string;
  redirectUrl?: string;
  message?: string;
}

export default abstract class ResponseApiServiceAdapterProvider {
  protected constructor() {}

  async send(res: Response, details: IDetails): Promise<Response<IResponseBase> | any> {
    const { data, clientCode, additionalResponse, message } = details;

    return responseApiUtil(res, {
      status: HttpStatus.ACCEPTED,
      success: true,
      clientCode: clientCode || '',
      data,
      additionalResponse,
      message
    });
  }
}

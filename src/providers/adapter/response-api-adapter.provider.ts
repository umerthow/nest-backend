import { Response } from 'express';
import { responseApiUtil } from '@utils/response-api.util';
import { IResponseBase } from '@interfaces/common/iresponse-api.interface';

export default abstract class ResponseApiServiceAdapterProvider {
  protected constructor() {}

  async send(res: Response, details: Record<string, any>): Promise<Response<IResponseBase> | any> {
    return responseApiUtil(res, details);
  }
}

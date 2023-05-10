import { getReasonPhrase } from 'http-status-codes';
import { Response } from 'express';
import { VERSION_API, VERSION_API_DATE } from '@constants/version.constant';
import { IResponseError, IResponseValidationError, IResponseBase } from '@interfaces/common/iresponse-api.interface';
import { HttpStatus } from '@nestjs/common';
import { suffleChar } from './transform.util';

interface IDetailError {
  success: boolean;
  status: number;
  message: string;
  type: string;
  clientCode?: string;
  errDescription?: string;
  errDetail:
    | Record<string, unknown>
    | Record<string, unknown>[]
    | undefined
    | IResponseValidationError
    | IResponseValidationError[];
}


export const responseApiErrorUtil = (response: Response, details: IDetailError): Response<IResponseError> => {
  const { success, status, message, type, clientCode, errDescription, errDetail } = details;
  return response.status(status).json({
    success,
    status,
    message: getReasonPhrase(status),
    apiVersion: VERSION_API,
    apiVersionDate: VERSION_API_DATE,
    error: {
      clientCode,
      description: errDescription || message,
      type,
      moreInfo: '-',
      detail: errDetail
    }
  });
};



export const responseApiUtil = (response: Response, details: Record<string, any>): Response<IResponseBase> => {

  const responseData = Object.keys(details)

  responseData.forEach((key) => {
    details[key] = suffleChar(details[key])
  })
  return response.status(HttpStatus.OK).json(details);
};

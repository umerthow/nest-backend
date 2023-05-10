import { getReasonPhrase } from 'http-status-codes';
import { Response } from 'express';
import { VERSION_API, VERSION_API_DATE } from '@constants/version.constant';
import { IResponseError, IResponseValidationError, IResponseBase } from '@interfaces/common/iresponse-api.interface';

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

interface IDetailParamResponse {
  success: boolean;
  status: number;
  message: string;
  clientCode: string;
  data?: Record<string, unknown> | Record<string, unknown>[];
  additionalResponse?: Record<string, any>;
  name?: string;
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

export const responseApiUtil = (response: Response, details: IDetailParamResponse): Response<IResponseBase> => {
  const { status, clientCode, success, message, data, additionalResponse } = details;
  return response.status(status).json({
    success,
    status,
    clientCode,
    message,
    apiVersion: VERSION_API,
    apiVersionDate: VERSION_API_DATE,
    data,
    ...additionalResponse
  });
};

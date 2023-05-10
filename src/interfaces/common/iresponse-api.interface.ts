export interface IClientCode {
  clientCode: string;
}

export interface IResponseValidationError {
  field: string;
  message: string;
  type: string;
}

export interface IResponseErrorHttp extends IClientCode {
  type: string;
  name: string;
  redirectUrl?: string;
  defaultDetail?: IResponseValidationError | IResponseValidationError[] | undefined;
  isShowLogErrorHttpService?: boolean;
  exceptionError?: Record<string, any>;
}

export interface IResponseErrorException {
  code: number;
  name: string;
  message: string;
  stack: string;
  detail: string;
}

export interface IResponseError {
  success: boolean;
  status: number;
  message: string;
  apiVersion: string;
  apiVersionDate: string;
  error: {
    clientCode?: number;
    type: string;
    description: string;
    moreInfo: string;
    detail: IResponseErrorException;
  };
}

export interface IResponseBase {
  success: boolean;
  clientCode: string;
  status: number;
  message: string;
  apiVersion: string;
  apiVersionDate: string;
}

export interface IPagination {
  page: number;
  limit: number;
  totalCount: number;
}

export interface IResponsePagination {
  pageSummary: IPagination;
}

import queryString from 'query-string';
import Accept from '@hapi/accept';
import { DEFAULT_LANGUAGE } from '@constants/common.constant';
import { IncomingHttpHeaders } from 'http';

export const parseQueryObjectToString = (parsed: Record<string, unknown>): string => queryString.stringify(parsed);

export const jsonToString = (jsonValue = {}) => JSON.stringify(jsonValue);

export const stringToJson = (stringValue = '{}') => JSON.parse(stringValue);

export const parseAcceptLanguageHeader = (acceptLanguage: string | undefined) =>
  Accept.language(acceptLanguage).split('-')[0] || DEFAULT_LANGUAGE;

export const parseRequestID = (headers: IncomingHttpHeaders) => {
  const xCloudTraceContext = headers['X-Cloud-Trace-Context'];
  return xCloudTraceContext && typeof xCloudTraceContext === 'string'
    ? xCloudTraceContext.split('/')[0]
    : new Date().valueOf();
};

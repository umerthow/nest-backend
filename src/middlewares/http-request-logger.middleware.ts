import morgan from 'morgan';
import { get, isEmpty } from 'lodash';

const httpRequestLoggerMiddleware = morgan((tokens, req, res) => {
  const body = get(req, 'body');
  if (!isEmpty(body)) {
    console.log(`${get(req, 'requestId')} |`, JSON.stringify(body));
  }
  return [
    get(req, 'requestId'),
    '|',
    tokens['remote-addr'](req, res),
    tokens['remote-user'](req, res),
    `[${tokens.date(req, res, 'clf')}]`,
    `"${tokens.method(req, res)} ${tokens.url(req, res)} ${tokens[
      'http-version'
    ](req, res)} ${tokens.status(req, res)} ${tokens.res(
      req,
      res,
      'content-length'
    )}"`,
    '-',
    tokens.referrer(req, res),
    tokens['user-agent'](req, res),
    `${tokens['response-time'](req, res)}ms`
  ].join(' ');
});

export default httpRequestLoggerMiddleware;

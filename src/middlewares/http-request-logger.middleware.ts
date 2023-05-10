import morgan from 'morgan';
import { get, isEmpty } from 'lodash';
import { createWriteStream } from "fs"
import path = require("path")

const httpRequestLoggerMiddleware = morgan((tokens, req, res) => {
  const body = get(req, 'body');
  if (!isEmpty(body)) {
    console.log(`${get(req, 'requestId')} |`, JSON.stringify(body));
    const unixTimeStamp = Math.floor(new Date().getTime() / 1000)
    const outputDirectory = path.join(__dirname, '../../log', `${unixTimeStamp}.json`);

    const fileDir = createWriteStream(outputDirectory)

    fileDir.write(JSON.stringify(JSON.stringify(body)))
    console.info(`log file..`, outputDirectory);
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

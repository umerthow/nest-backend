import Redis from 'ioredis';
import { isEmpty } from 'lodash';
import { Repository } from 'typeorm';
import { MessagesEntity } from '@models/entities/messages.entity';
import { jsonToString, stringToJson } from '@utils/parse.util';
import { REDIS_MESSAGE_PREFIX_KEY } from '@constants/common.constant';

interface IMessageValueParam {
  clientCode?: string | number;
  language?: string;
  redisService: Redis;
  messageRepository: Repository<MessagesEntity>;
  type?: string;
  isErrorValidation?: boolean;
  errorServerCode?: string;
}

export async function getMessageValue({
  clientCode,
  language,
  redisService,
  messageRepository,
  type,
  isErrorValidation,
  errorServerCode
}: IMessageValueParam) {
  const redisKey = REDIS_MESSAGE_PREFIX_KEY;
  let getRedisValue = await redisService.get(redisKey);

  if (!getRedisValue) {
    const getMessages = await messageRepository.find({
      select: ['id', 'success', 'clientCode', 'status', 'message', 'language', 'errorServerCode', 'errorDetail']
    });
    const getMessageString = jsonToString(getMessages);
    redisService.set(redisKey, getMessageString);
    getRedisValue = getMessageString;
  }

  let redisMessageParse = stringToJson(getRedisValue);

  const isNotFoundMessage = isEmpty(
    redisMessageParse.find(
      (data: Record<string, unknown>) =>
        (data.clientCode === clientCode || data.errorServerCode === errorServerCode) && data.language === language
    )
  );
  if (isNotFoundMessage) {
    const getSpecificMessage = await messageRepository.findOne({
      where: [
        {
          clientCode: clientCode as string,
          language
        },
        {
          errorServerCode,
          language
        }
      ],
      select: ['id', 'success', 'clientCode', 'status', 'message', 'language', 'errorServerCode', 'errorDetail']
    });
    if (!isEmpty(getSpecificMessage)) {
      const oldMessages = stringToJson(getRedisValue);
      const newMessages = [...oldMessages, getSpecificMessage];
      redisService.set(redisKey, jsonToString(newMessages));
      getRedisValue = jsonToString(newMessages);
      redisMessageParse = await stringToJson(getRedisValue || '{}');
    }
  }

  const getMessage = redisMessageParse.find((data: Record<string, unknown>) => {
    if ((data.clientCode === clientCode || data.errorServerCode === errorServerCode) && data.language === language) {
      return {
        clientCode,
        language,
        errorServerCode: isErrorValidation ? type : null
      };
    }
    return null;
  });

  return getMessage;
}

import { Repository } from 'typeorm';
import { MessagesEntity } from '@models/entities/messages.entity';
interface IMessageValueParam {
  clientCode?: string | number;
  language?: string;
  messageRepository: Repository<MessagesEntity>;
  type?: string;
  isErrorValidation?: boolean;
  errorServerCode?: string;
}

export async function getMessageValue({
  messageRepository,
}: IMessageValueParam) {

  const getMessages = await messageRepository.find({
    select: ['id', 'success', 'clientCode', 'status', 'message', 'language', 'errorServerCode', 'errorDetail']
  });

  return getMessages;
}

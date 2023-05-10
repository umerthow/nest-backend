import { Injectable } from '@nestjs/common';
import { PubSub } from '@google-cloud/pubsub';

const pubSubClient = new PubSub();

@Injectable()
export default class PubSubEventProvider {
  publishMessage(topicVariable: Record<string, string>, message: Record<string, unknown>): Promise<void> {
    const dataBuffer = Buffer.from(JSON.stringify(message));
    const topicName = topicVariable[process.env.TARGET_ENV || 'local'];
    return pubSubClient
      .topic(topicName)
      .publishMessage({ data: dataBuffer })
      .then((messageId) => console.log(`[${topicName.toUpperCase()}] Message ${messageId} published.`))
      .catch((error) =>
        console.error(`[${topicName.toUpperCase()}] Received error while publishing: ${error.message}`)
      );
  }
}

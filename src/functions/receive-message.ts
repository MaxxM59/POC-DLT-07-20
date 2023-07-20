import * as Pulsar from 'pulsar-client';
import { POCConfig, mock_nack, print, print_err } from '../util/helper';

export async function handle_message(
  message: Pulsar.Message,
  consumer: Pulsar.Consumer,
  consumer_name: string,
  config: POCConfig
): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (message === null) {
    print(`[${consumer_name}] No message !`);
    return;
  }

  print(
    `[${consumer_name}] Handling message: ${message.getData().toString()} 
              => Delivery : ${message.getRedeliveryCount()}/${config.consumers.dead_letter.max_redelivery}
              => Topic: ${message.getTopicName()}
              => Partition: ${message.getPartitionKey()}`
  );
  // Other properties from current message
  //
  //    => MessageId: ${message.getMessageId()}
  //    => PublishTimestamp: ${message.getPublishTimestamp()}
  //    => EventTimestamp: ${message.getEventTimestamp()}
  //    => Properties: ${JSON.stringify(message.getProperties())}
  //
  try {
    if (config.consumers.mock.nack && (await mock_nack(message, config.consumers.dead_letter.max_redelivery))) {
      consumer.negativeAcknowledge(message);
      print(`[${consumer_name}] Negative Acknowledged message : ${message.getData().toString()} }`);
    } else {
      await consumer.acknowledge(message);
      print(`[${consumer_name}] Acknowledged message : ${message.getData().toString()} }`);
    }
  } catch (e) {
    print_err(`[${consumer_name}] Failed to process message ${message.getData().toString()}: ${e}`);
    consumer.negativeAcknowledge(message);
  }
}

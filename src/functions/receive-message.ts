import * as Pulsar from 'pulsar-client';
import { mock_nack, print, print_err } from '../util/helper';
import { POCConfig } from '../util/interfaces';

const RECEIVE_MESSAGE = 'Receive message';
const ACK_NACK = 'Ack/nAck';
export async function handle_message(
  message: Pulsar.Message,
  consumer: Pulsar.Consumer,
  consumer_name: string,
  config: POCConfig
): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (message === null) {
    print(`[${consumer_name}] No message !`, RECEIVE_MESSAGE);
    return;
  }

  print(
    `[${consumer_name}] Handling message: ${message.getData().toString()} 
=> Delivery count: ${message.getRedeliveryCount()}/${config.consumers.dead_letter.max_redelivery}
=> Topic name: ${message.getTopicName()}
=> Partition key: ${message.getPartitionKey()}`,
    RECEIVE_MESSAGE
  );
  // Other properties from current message
  //
  //                        => MessageId: ${message.getMessageId()}
  //                        => PublishTimestamp: ${message.getPublishTimestamp()}
  //                        => EventTimestamp: ${message.getEventTimestamp()}
  //                        => Properties: ${JSON.stringify(message.getProperties())}
  //
  await handle_ack_nack(config, consumer, consumer_name, message);
}

async function handle_ack_nack(
  config: POCConfig,
  consumer: Pulsar.Consumer,
  consumer_name: string,
  message: Pulsar.Message
): Promise<void> {
  try {
    if (
      config.consumers.mock.nack &&
      (await mock_nack(
        message,
        config.consumers.dead_letter.max_redelivery,
        config.consumers.mock.ack_on_last_redelivery
      ))
    ) {
      consumer.negativeAcknowledge(message);
      print(`[${consumer_name}] Negative Acknowledged message : ${message.getData().toString()} }`, ACK_NACK);
    } else {
      await consumer.acknowledge(message);
      print(`[${consumer_name}] Acknowledged message : ${message.getData().toString()} }`, ACK_NACK);
    }
  } catch (e) {
    print_err(`[${consumer_name}] Failed to process message ${message.getData().toString()}: ${e}`, ACK_NACK);
    consumer.negativeAcknowledge(message);
  }
}

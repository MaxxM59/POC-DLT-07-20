import * as Pulsar from 'pulsar-client';
import { mock_nack, print, print_err, stringify } from '../util/helper';
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
  await handle_ack_nack(config, consumer, consumer_name, message);
}

async function handle_ack_nack(
  config: POCConfig,
  consumer: Pulsar.Consumer,
  consumer_name: string,
  message: Pulsar.Message
): Promise<void> {
  try {
    const should_nack = config.consumers.mock.nack && (await mock_nack(message, config));

    if (config.print.receive.enabled) {
      await print_message_data(config, message, consumer_name, !should_nack);

      if (should_nack) {
        consumer.negativeAcknowledge(message);
      } else {
        await consumer.acknowledge(message);
      }
    }
  } catch (e) {
    print_err(`[${consumer_name}] Failed to process message ${message.getData().toString()}: ${e}`, ACK_NACK);
    consumer.negativeAcknowledge(message);
  }
}

async function print_message_data(
  config: POCConfig,
  message: Pulsar.Message,
  consumer_name: string,
  postitive: boolean
): Promise<void> {
  const redelivery = config.print.receive.redelivery_count
    ? `=> Delivery : [${message.getRedeliveryCount()}/${config.consumers.dead_letter.max_redelivery}]`
    : '';

  const topic = config.print.receive.topic
    ? `=> Topic : [${message.getTopicName().split('persistent://public/default/').pop()}]`
    : '';

  const partition_key =
    config.print.receive.partition_key && message.getPartitionKey() !== ''
      ? `=> Partition key : [${message.getPartitionKey()}]`
      : '';

  const publish_timestamp = `${
    config.print.receive.publish_timestamp ? `=> PublishTimestamp: ${message.getPublishTimestamp()}` : ''
  }`;
  const event_timestamp = `${
    config.print.receive.event_timestamp ? `=> EventTimestamp: ${message.getEventTimestamp()}` : ''
  }`;
  const properties = `${
    config.print.receive.event_timestamp ? `=> Properties: ${stringify(message.getProperties())}` : ''
  }`;
  print(
    `[${consumer_name}] ${postitive ? 'ACKED' : 'NACKED'} : ${message
      .getData()
      .toString()} ${redelivery} ${topic} ${partition_key} ${publish_timestamp} ${event_timestamp} ${properties}`,
    ACK_NACK
  );
}

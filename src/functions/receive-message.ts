import * as Pulsar from 'pulsar-client';
import { mock_nack, parse_print, print, print_err } from '../util/helper';
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

  if (config.print.receive.enabled) {
    print(await parse_print(config, consumer_name, message), RECEIVE_MESSAGE);
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
    if (
      config.consumers.mock.nack &&
      (await mock_nack(
        message,
        config.consumers.dead_letter.max_redelivery,
        config.consumers.mock.ack_on_last_redelivery,
        config.consumers.mock.nack_odd
      ))
    ) {
      if (config.print.ack_nack.enabled) {
        await print_ack_nack_msg(config, message, consumer_name, false);
      }
      consumer.negativeAcknowledge(message);
    } else {
      if (config.print.ack_nack.enabled) {
        await print_ack_nack_msg(config, message, consumer_name, true);
      }
      await consumer.acknowledge(message);
    }
  } catch (e) {
    print_err(`[${consumer_name}] Failed to process message ${message.getData().toString()}: ${e}`, ACK_NACK);
    consumer.negativeAcknowledge(message);
  }
}

async function print_ack_nack_msg(
  config: POCConfig,
  message: Pulsar.Message,
  consumer_name: string,
  postitive: boolean
): Promise<void> {
  const redelivery = config.print.ack_nack.redelivery_count
    ? `=> Delivery : [${message.getRedeliveryCount()}/${config.consumers.dead_letter.max_redelivery}]`
    : '';

  const topic = config.print.ack_nack.topic
    ? `=> Topic : [${message.getTopicName().split('persistent://public/default/').pop()}]`
    : '';

  const partition_key =
    config.print.ack_nack.partition_key && message.getPartitionKey() !== ''
      ? `=> Partition key : [${message.getPartitionKey()}]`
      : '';
  print(
    `[${consumer_name}] ${postitive ? 'ACKED' : 'NACKED'} : ${message
      .getData()
      .toString()} ${redelivery} ${topic} ${partition_key}`,
    ACK_NACK
  );
}

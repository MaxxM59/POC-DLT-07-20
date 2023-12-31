import * as Pulsar from 'pulsar-client';
import { print, mock_order_key, mock_partition_key, print_error } from '../util/helper';
import { POCConfig, SeededConsumer } from '../util/interfaces';
import { close } from './close';
import { mock_half } from './mock';

const PRODUCE_MESSAGE = 'PRODUCE MESSAGES';

export async function produce_messages(
  client: Pulsar.Client,
  producer: Pulsar.Producer,
  config: POCConfig,
  consumers: SeededConsumer[]
): Promise<void> {
  await assert_no_message(producer, config);

  try {
    for (let i = 1; i <= config.messages.total_messages; i++) {
      const msg = `message-${i}`;
      const ordering_key = config.messages.ordering_key ? mock_order_key(config.consumers.consumers_number) : undefined;
      const partition_key = config.messages.partition_key ? mock_partition_key() : undefined;

      await producer.send({
        data: Buffer.from(msg),
        orderingKey: ordering_key,
        partitionKey: partition_key,
      });
      if (ordering_key !== undefined) {
        print(`[${producer.getProducerName()}] -- Ordering key for ${msg} : ${ordering_key}`, PRODUCE_MESSAGE);
      }
      // Mock sub/unsub at half
      if (i === Math.ceil(config.messages.total_messages / 2)) {
        consumers = await mock_half(client, config, consumers);
      }
    }

    // Close
    if (config.messages.close_after_messages_sent) {
      await close(producer, consumers, client);
    }
  } catch (e) {
    print_error(e, PRODUCE_MESSAGE);
    throw e;
  }
}

async function assert_no_message(producer: Pulsar.Producer, config: POCConfig): Promise<void> {
  try {
    print(
      `[${producer.getProducerName()}] Cleaning producer before sending ${config.messages.total_messages} messages`,
      PRODUCE_MESSAGE
    );
    await producer.flush();
  } catch (e) {
    print_error(e, PRODUCE_MESSAGE);
    throw e;
  }
}

import * as Pulsar from 'pulsar-client';
import { print, print_err, mock_key } from '../util/helper';
import { POCConfig, SeededConsumer } from '../util/interfaces';
import { close } from './close';
import { mock_end, mock_half } from './mock';

export async function produce_messages(
  client: Pulsar.Client,
  producer: Pulsar.Producer,
  config: POCConfig,
  consumers: SeededConsumer[]
): Promise<void> {
  await flush(producer, config);

  for (let i = 1; i <= config.messages.total_messages; i++) {
    const msg = `message-${i}`;
    await producer.send({
      data: Buffer.from(msg),
      orderingKey: config.messages.ordering_key ? mock_key(config.consumers.consumers_number) : undefined,
      partitionKey: config.messages.partition_key ? mock_key(config.consumers.consumers_number) : undefined,
    });

    // Mock sub/unsub at half
    if (i === Math.ceil(config.messages.total_messages / 2)) {
      consumers = await mock_half(client, config, consumers);
    }
  }

  // Mock sub/unsub at end
  consumers = await mock_end(client, config, consumers);

  // Close
  if (config.messages.close_after_messages_sent) {
    await close(producer, consumers, client);
  }
}

async function flush(producer: Pulsar.Producer, config: POCConfig): Promise<void> {
  try {
    print(
      `[${producer.getProducerName()}] Cleaning producer before sending ${config.messages.total_messages} messages`
    );
    // Assert no msg
    await producer.flush();
  } catch (e) {
    if (e instanceof Error) {
      print_err(e.message);
    }
    throw e;
  }
}

import * as Pulsar from 'pulsar-client';
import { print, print_err, mock_partition_key, sleep } from '../util/helper';
import { create_consumer } from './seed';
import { POCConfig, SeededConsumer } from '../util/interfaces';

export async function produce_messages(
  client: Pulsar.Client,
  producer: Pulsar.Producer,
  config: POCConfig,
  consumers: SeededConsumer[]
): Promise<void> {
  try {
    print(
      `[${producer.getProducerName()}] Cleaning producer before sending ${config.messages.total_messages} messages`
    );
    // Assert no msg
    await producer.flush();
  } catch (e) {
    print_err(e);
    throw e;
  }
  for (let i = 1; i <= config.messages.total_messages; i++) {
    const msg = `my-message-${i}`;
    await producer.send({
      data: Buffer.from(msg),
      orderingKey: mock_partition_key(config.consumers.consumers_number),
      partitionKey: mock_partition_key(config.consumers.consumers_number),
    });

    if (i === Math.ceil(config.messages.total_messages / 2)) {
      if (config.consumers.mock.unsub_half) {
        consumers = await remove_first_consumer(consumers);
      }
      if (config.consumers.mock.add_sub_half) {
        consumers = await add_consumer(client, config, consumers, true);
      }
    }
  }
  if (config.consumers.mock.add_sub_end) {
    consumers = await add_consumer(client, config, consumers, false);
  }
}

async function remove_first_consumer(consumers: SeededConsumer[]): Promise<SeededConsumer[]> {
  await sleep(2000);
  print(`Closing ${consumers[0].name} after sending 1st half of messages`);
  await consumers[0].consumer.close();
  return consumers.slice(0, 1);
}

async function add_consumer(
  client: Pulsar.Client,
  config: POCConfig,
  consumers: SeededConsumer[],
  half: boolean
): Promise<SeededConsumer[]> {
  const new_consumer_name = `CONSUMER-${consumers.length + 1}`;
  print(
    `Opening new consumer after ${
      half ? 'sending 1st half of messages' : 'all messages were sent'
    } : ${new_consumer_name}`
  );
  const new_consumer = await create_consumer(client, config, new_consumer_name);
  consumers.push({ consumer: new_consumer, name: new_consumer_name });
  return consumers;
}

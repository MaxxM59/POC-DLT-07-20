import * as Pulsar from 'pulsar-client';
import { POCConfig, print, print_err, mock_partition_key, sleep } from '../util/helper';
import { SeededConsumer, create_consumer } from './seed';

export async function send_messages(
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
      await sleep(2000);
      print(`Closing ${consumers[0].name} after sending 1st half of messages`);
      await consumers[0].consumer.close();
      const new_consumer_name = `CONSUMER-${consumers.length + 1}`;
      print(`Opening new consumer after sending 1st half of messages : ${new_consumer_name}`);
      const new_consumer = await create_consumer(client, config, new_consumer_name);
      consumers.push({ consumer: new_consumer, name: new_consumer_name });
    }
  }
  await sleep(2000);
  const new_consumer_name = `CONSUMER-${consumers.length + 1}`;
  print(`Opening new consumer after all messages were sent : ${new_consumer_name}`);
  const new_consumer = await create_consumer(client, config, new_consumer_name);
  print(`Opening new consumer after all messages were sent : ${new_consumer_name}`);
  consumers.push({ consumer: new_consumer, name: new_consumer_name });
  await create_consumer(client, config, new_consumer_name);
}

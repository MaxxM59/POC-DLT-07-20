import { sleep } from '../util/helper';
import { POCConfig, SeededConsumer } from '../util/interfaces';
import { create_consumer } from './seed';
import * as Pulsar from 'pulsar-client';

export async function add_consumer(
  client: Pulsar.Client,
  config: POCConfig,
  consumers: SeededConsumer[],
  half: boolean
): Promise<SeededConsumer[]> {
  const new_consumer_name = `CONSUMER-${consumers.length + 1}`;
  await sleep(
    2000,
    `Opening new consumer after ${
      half ? 'sending 1st half of messages' : 'all messages were sent'
    } : ${new_consumer_name}`
  );
  const new_consumer = await create_consumer(client, config, new_consumer_name);
  consumers.push(new_consumer);
  return consumers;
}

export async function unsub_first_consumer(consumers: SeededConsumer[]): Promise<void> {
  await sleep(2000, `Unsubscribing ${consumers[0].name} after sending 1st half of messages`);
  await consumers[0].consumer.unsubscribe();
}

export async function close_first_consumer(consumers: SeededConsumer[]): Promise<void> {
  await sleep(2000, `Closing ${consumers[0].name} after sending 1st half of messages`);
  await consumers[0].consumer.close();
}

export async function resub_first_consumer(
  client: Pulsar.Client,
  config: POCConfig,
  consumers: SeededConsumer[]
): Promise<void> {
  await sleep(2000, `Reopening ${consumers[0].name} after all messages were sent`);
  await create_consumer(client, config, consumers[0].name);
}

export async function mock_failover(
  client: Pulsar.Client,
  config: POCConfig,
  consumers: SeededConsumer[],
  half: boolean
): Promise<SeededConsumer[]> {
  await sleep(2000, `Mocking failover`);
  consumers = await add_consumer(client, config, consumers, half);
  await unsub_first_consumer(consumers);

  await resub_first_consumer(client, config, consumers);
  await consumers[consumers.length - 1].consumer.unsubscribe();

  return consumers;
}

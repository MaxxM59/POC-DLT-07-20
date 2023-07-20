import { print_err, sleep } from '../util/helper';
import { POCConfig, SeededConsumer } from '../util/interfaces';
import { create_consumer } from './seed';
import * as Pulsar from 'pulsar-client';

const MOCK_ADD_CONSUMER = 'MOCK ADD CONSUMER';
const UNSUB_FIRST_CONSUMER = 'UNSUB FIRST CONSUMER';
const CLOSE_FIRST_CONSUMER = 'CLOSE FIRST CONSUMER';
const RESUB_FIRST_CONSUMER = 'RESUB FIRST CONSUMER';
const MOCK_FAILOVER = 'MOCK FAILOVER';
export async function add_consumer(
  client: Pulsar.Client,
  config: POCConfig,
  consumers: SeededConsumer[],
  half: boolean
): Promise<SeededConsumer[]> {
  try {
    const new_consumer_name = `CONSUMER-${consumers.length + 1}`;
    await sleep(
      2000,
      MOCK_ADD_CONSUMER,
      `Opening new consumer after ${
        half ? 'sending 1st half of messages' : 'all messages were sent'
      } : ${new_consumer_name}`
    );
    const new_consumer = await create_consumer(client, config, new_consumer_name);
    consumers.push(new_consumer);
    return consumers;
  } catch (e) {
    if (e instanceof Error) {
      print_err(e.message, MOCK_ADD_CONSUMER);
      throw e;
    } else {
      throw e;
    }
  }
}

export async function unsub_first_consumer(consumers: SeededConsumer[]): Promise<void> {
  try {
    await sleep(2000, UNSUB_FIRST_CONSUMER, `Unsubscribing ${consumers[0].name} after sending 1st half of messages`);
    await consumers[0].consumer.unsubscribe();
  } catch (e) {
    if (e instanceof Error) {
      print_err(e.message, UNSUB_FIRST_CONSUMER);
      throw e;
    } else {
      throw e;
    }
  }
}
export async function close_first_consumer(consumers: SeededConsumer[]): Promise<void> {
  await sleep(2000, CLOSE_FIRST_CONSUMER, `Closing ${consumers[0].name} after sending 1st half of messages`);
  await consumers[0].consumer.close();
  try {
  } catch (e) {
    if (e instanceof Error) {
      print_err(e.message, CLOSE_FIRST_CONSUMER);
      throw e;
    } else {
      throw e;
    }
  }
}

export async function resub_first_consumer(
  client: Pulsar.Client,
  config: POCConfig,
  consumers: SeededConsumer[]
): Promise<void> {
  await sleep(2000, RESUB_FIRST_CONSUMER, `Reopening ${consumers[0].name} after all messages were sent`);
  await create_consumer(client, config, consumers[0].name);
  try {
  } catch (e) {
    if (e instanceof Error) {
      print_err(e.message, RESUB_FIRST_CONSUMER);
      throw e;
    } else {
      throw e;
    }
  }
}

export async function mock_failover(
  client: Pulsar.Client,
  config: POCConfig,
  consumers: SeededConsumer[],
  half: boolean
): Promise<SeededConsumer[]> {
  try {
    await sleep(2000, MOCK_FAILOVER, `Mocking failover`);
    consumers = await add_consumer(client, config, consumers, half);
    await unsub_first_consumer(consumers);

    await resub_first_consumer(client, config, consumers);
    await consumers[consumers.length - 1].consumer.unsubscribe();

    return consumers;
  } catch (e) {
    if (e instanceof Error) {
      print_err(e.message, MOCK_FAILOVER);
      throw e;
    } else {
      throw e;
    }
  }
}

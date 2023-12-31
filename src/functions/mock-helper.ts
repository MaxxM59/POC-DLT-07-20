import { print, print_error } from '../util/helper';
import { POCConfig, SeededConsumer } from '../util/interfaces';
import { create_consumer } from './seed';
import * as Pulsar from 'pulsar-client';

const MOCK_ADD_CONSUMER = 'MOCK ADD CONSUMER';
const UNSUB_FIRST_CONSUMER = 'UNSUB FIRST CONSUMER';
const CLOSE_FIRST_CONSUMER = 'CLOSE FIRST CONSUMER';
const RESUB_FIRST_CONSUMER = 'RESUB FIRST CONSUMER';

export async function add_consumer(
  client: Pulsar.Client,
  config: POCConfig,
  consumers: SeededConsumer[],
  half: boolean
): Promise<SeededConsumer[]> {
  try {
    const new_consumer_name = `CONSUMER-${consumers.length + 1}`;

    const new_consumer = await create_consumer(client, config, new_consumer_name);
    consumers.push(new_consumer);
    print(
      `Opened new consumer after ${
        half ? 'sending 1st half of messages' : 'all messages were sent'
      } : ${new_consumer_name}`,
      MOCK_ADD_CONSUMER
    );
    return consumers;
  } catch (e) {
    print_error(e, MOCK_ADD_CONSUMER);
    throw e;
  }
}

export async function unsub_first_consumer(config: POCConfig, consumers: SeededConsumer[]): Promise<void> {
  try {
    await consumers[0].consumer.unsubscribe();
    print(
      `Unsubscribed ${consumers[0].name} after sending ${config.messages.total_messages / 2} messages`,
      UNSUB_FIRST_CONSUMER
    );
  } catch (e) {
    print_error(e, UNSUB_FIRST_CONSUMER);
    throw e;
  }
}
export async function close_first_consumer(config: POCConfig, consumers: SeededConsumer[]): Promise<void> {
  await consumers[0].consumer.close();
  print(
    `Closed ${consumers[0].name} after sending ${config.messages.total_messages / 2} messages`,
    CLOSE_FIRST_CONSUMER
  );
  try {
  } catch (e) {
    print_error(e, CLOSE_FIRST_CONSUMER);
    throw e;
  }
}

export async function resub_first_consumer(
  client: Pulsar.Client,
  config: POCConfig,
  consumers: SeededConsumer[],
  half: boolean
): Promise<void> {
  try {
    await create_consumer(client, config, consumers[0].name);
    print(
      `Reopened ${consumers[0].name} after ${
        half ? `sending ${config.messages.total_messages / 2} messages` : 'all messages were sent'
      } `,
      RESUB_FIRST_CONSUMER
    );
  } catch (e) {
    print_error(e, RESUB_FIRST_CONSUMER);
    throw e;
  }
}

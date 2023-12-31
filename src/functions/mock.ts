import { POCConfig, SeededConsumer } from '../util/interfaces';
import { unsub_first_consumer, close_first_consumer, add_consumer, resub_first_consumer } from './mock-helper';
import * as Pulsar from 'pulsar-client';

export async function mock_half(
  client: Pulsar.Client,
  config: POCConfig,
  consumers: SeededConsumer[]
): Promise<SeededConsumer[]> {
  if (config.consumers.mock.unsub_first_consumer_half && config.consumers.mock.close_first_consumer_half) {
    throw Error(`Cannot unsubscribe and close at the same time`);
  }

  if (config.consumers.mock.unsub_first_consumer_half) {
    await unsub_first_consumer(config, consumers);
  }

  if (config.consumers.mock.close_first_consumer_half) {
    await close_first_consumer(config, consumers);
  }

  if (config.consumers.mock.add_sub_half) {
    consumers = await add_consumer(client, config, consumers, true);
  }

  if (config.consumers.mock.reopen_first_consumer_half) {
    await resub_first_consumer(client, config, consumers, true);
  }
  return consumers;
}

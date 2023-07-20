import * as Pulsar from 'pulsar-client';
import { parse_env } from './util/env';

import { POCConfig } from './util/interfaces';
import { create_producer, seed_consumers, init_client } from './functions/seed';
import { produce_messages } from './functions/send-messages';

async function run(client: Pulsar.Client, config: POCConfig): Promise<void> {
  const producer = await create_producer(client, config);
  const consumers = await seed_consumers(client, config, config.consumers.consumers_number);
  await produce_messages(client, producer, config, consumers);
}

void (async (): Promise<void> => {
  const client = await init_client();
  const config = await parse_env();
  await run(client, config);
})();

import * as Pulsar from 'pulsar-client'
import { parse_env } from './util/env';

import { POCConfig } from './util/helper';
import { create_producer, seed_consumers, init_client } from './functions/seed';
import { send_messages } from './functions/send-messages';

async function run(client: Pulsar.Client, config: POCConfig): Promise<void> {
  const producer = await create_producer(client, config);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const consumers = await seed_consumers(client, config, config.consumers.consumers_number);

  await send_messages(client, producer, config, consumers);
  //
  // Closing prevent from retried messages to be consumed
  //
  // const sleep_time = 10000;
  // print(`Sleeping for ${format_time(sleep_time)} to allow consumer to consume all messages`);
  // await sleep(sleep_time);

  // await close(producer, CONSUMERS, client);
}

void (async (): Promise<void> => {
  const client = await init_client();

  const config = await parse_env();

  await run(client, config);
})();

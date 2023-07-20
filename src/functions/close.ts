import * as Pulsar from 'pulsar-client';

import { print, print_err } from '../util/helper';
import { SeededConsumer } from '../util/interfaces';

export async function close(
  producer: Pulsar.Producer,
  consumers: SeededConsumer[],
  client: Pulsar.Client
): Promise<void> {
  try {
    await producer.flush();
    print(`Flushed producer`);

    await producer.close();
    print(`Closed producer`);

    await Promise.all(
      consumers.map(async c => {
        await c.consumer.close();
      })
    );

    print(`Closed ${consumers.length > 1 ? 'consumers' : 'consumer'}`);

    await client.close();
    print(`Closed client`);
  } catch (e) {
    print_err(e);
  }
}

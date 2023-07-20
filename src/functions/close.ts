import * as Pulsar from 'pulsar-client';

import { print, print_err, sleep } from '../util/helper';
import { SeededConsumer } from '../util/interfaces';
const CLOSE = 'Close';
export async function close(
  producer: Pulsar.Producer,
  consumers: SeededConsumer[],
  client: Pulsar.Client
): Promise<void> {
  await sleep(5000, 'CLOSE', 'Closing app');
  print(`Closing instances after 5s`, CLOSE);
  try {
    await producer.flush();
    print(`Flushed producer`, CLOSE);

    await producer.close();
    print(`Closed producer`, CLOSE);

    await Promise.all(
      consumers.map(async c => {
        if (c.consumer.isConnected()) {
          await c.consumer.close();
        }
      })
    );

    print(`Closed ${consumers.length > 1 ? 'consumers' : 'consumer'}`, CLOSE);

    await client.close();
    print(`Closed client`, CLOSE);
    process.exit(0);
  } catch (e) {
    if (e instanceof Error) {
      print_err(e.message, CLOSE);
    } else throw e;
  }
}

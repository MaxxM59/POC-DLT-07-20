import * as Pulsar from 'pulsar-client';

import { POCConfig, print, print_err } from '../util/helper';
import { handle_message } from './receive-message';
export interface SeededConsumer {
  name: string;
  consumer: Pulsar.Consumer;
}

// Init pulsar client
export async function init_client(): Promise<Pulsar.Client> {
  return new Pulsar.Client({
    serviceUrl: 'pulsar://localhost:6650',
    operationTimeoutSeconds: 30,
  });
}

// Create producer
export async function create_producer(client: Pulsar.Client, config: POCConfig): Promise<Pulsar.Producer> {
  const producer_name = 'POC-producer';
  print(`Creating producer ${producer_name}`);

  const producer = await client.createProducer({
    topic: config.topic_name,
    producerName: config.producer.name,
    sendTimeoutMs: config.producer.send_timeout_ms,
    hashingScheme: config.producer.hashing_scheme,
    messageRoutingMode: config.producer.routing_mode,
  });

  print(`Successfully created producer ${producer_name}`);
  return producer;
}

export async function seed_consumers(
  client: Pulsar.Client,
  config: POCConfig,
  consumers_number: number
): Promise<SeededConsumer[]> {
  const CONSUMERS: SeededConsumer[] = [];

  for (let i = 1; i <= consumers_number; i++) {
    const name = `CONSUMER-${i}`;
    const consumer = await create_consumer(client, config, name);
    CONSUMERS.push({ name: name, consumer: consumer });
  }
  return CONSUMERS;
}

export async function create_consumer(
  client: Pulsar.Client,
  config: POCConfig,
  consumer_name: string
): Promise<Pulsar.Consumer> {
  try {
    print(`Creating consumer ${consumer_name}`);

    const consumer = await client.subscribe({
      ackTimeoutMs: config.consumers.ack_timeout,
      nAckRedeliverTimeoutMs: config.consumers.nack_timeout,
      topic: config.topic_name,
      subscription: `POC-subscription-${consumer_name}`,
      subscriptionType: 'KeyShared',
      deadLetterPolicy: {
        deadLetterTopic: config.consumers.dead_letter.dlq_topic_name,
        maxRedeliverCount: config.consumers.dead_letter.max_redelivery,
        initialSubscriptionName: `${config.consumers.dead_letter.dlq_topic_name}-sub`,
      },

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      listener: async (message, consumer): Promise<void> => {
        // await print_topic_partitons(client, config.producer.topic_name);
        // await print_topic_partitons(client, config.producer.dlq_topic_name);
        await handle_message(message, consumer, consumer_name, config);
      },
    });

    print(`Successfully created consumer ${consumer_name}`);
    return consumer;
  } catch (e) {
    print_err(`Failed to create consumer ${consumer_name} :  ${e}`);
    throw Error(e);
  }
}

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

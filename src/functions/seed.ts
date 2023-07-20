import * as Pulsar from 'pulsar-client';

import { print, print_err, print_topic_partitons } from '../util/helper';
import { handle_message } from './receive-message';
import { POCConfig, SeededConsumer } from '../util/interfaces';

const CREATE_PRODUCER = 'Create producer';

const CREATE_CONSUMER = 'Create consumer';

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
  print(`Creating producer ${producer_name}`, CREATE_PRODUCER);

  const producer = await client.createProducer({
    topic: config.topic_name,
    producerName: config.producer.name,
    sendTimeoutMs: config.producer.send_timeout_ms,
    hashingScheme: config.producer.hashing_scheme,
    messageRoutingMode: config.producer.routing_mode,
  });

  print(`Successfully created producer ${producer_name}`, CREATE_PRODUCER);
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
    CONSUMERS.push(consumer);
  }
  return CONSUMERS;
}

export async function create_consumer(
  client: Pulsar.Client,
  config: POCConfig,
  consumer_name: string
): Promise<SeededConsumer> {
  try {
    print(`Creating consumer ${consumer_name}`, CREATE_CONSUMER);

    // const sub_name = `POC-subscription-${consumer_name}`;
    //const split = consumer_name.split('-');

    // const topic_name = `${config.topic_name}-partition-${split[split.length - 1]}`;

    const consumer = await client.subscribe({
      ackTimeoutMs: config.consumers.ack_timeout,
      nAckRedeliverTimeoutMs: config.consumers.nack_timeout,
      topic: config.topic_name,
      subscription: 'POC-subscription',
      subscriptionType: config.consumers.sub_type,
      subscriptionInitialPosition: config.consumers.intial_position,
      deadLetterPolicy: {
        deadLetterTopic: config.consumers.dead_letter.dlq_topic_name,
        maxRedeliverCount: config.consumers.dead_letter.max_redelivery,
        initialSubscriptionName: `${config.consumers.dead_letter.dlq_topic_name}-sub`,
      },

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      listener: async (message, consumer): Promise<void> => {
        if (config.consumers.print_partitions) {
          await print_topic_partitons(client, config);
        }
        await handle_message(message, consumer, consumer_name, config);
      },
    });

    print(`Successfully created consumer ${consumer_name}`, CREATE_CONSUMER);
    return { name: consumer_name, sub_name: 'POC-subscription', consumer: consumer };
  } catch (e) {
    print_err(`Failed to create consumer ${consumer_name} :  ${e}`, CREATE_CONSUMER);
    throw e;
  }
}

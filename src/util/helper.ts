/* eslint-disable no-console */
import * as Pulsar from 'pulsar-client';

export interface POCConfig {
  topic_name: string;
  producer: ProducerConfig;
  messages: MessageConfig;
  consumers: ConsumersConfig;
}

export interface ProducerConfig {
  name: string;
  send_timeout_ms: number;
  hashing_scheme: Pulsar.HashingScheme;
  routing_mode: Pulsar.MessageRoutingMode;
}

export interface MessageConfig {
  total_messages: number;
  produce_messages_batch: number;
}

export interface ConsumersConfig {
  consumers_number: number;
  nack_timeout: number;
  ack_timeout: number;
  dead_letter: {
    dlq_topic_name: string;
    max_redelivery: number;
  };
  mock: {
    nack: boolean;
    add_sub_half: boolean;
    add_sub_end: boolean;
    unsub_half: boolean;
  };
}
// Way to get nack based on % 2
export async function mock_nack(message: Pulsar.Message, max_redelivery: number): Promise<boolean> {
  const split = message.getData().toString().split('-');
  if (message.getRedeliveryCount() === max_redelivery) {
    return false;
  } else {
    return parseInt(split[split.length - 1], 10) % 2 !== 0;
  }
}

// Sleep
export async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => {
    console.log(`\n\nSleeping for ${ms}ms...\n\n`);
    setTimeout(resolve, ms);
  });
}

export function make_dlq_name(name: string): string {
  return `${name}-DLQ`;
}

export function format_time(time: number | Date): string {
  if (typeof time === 'number') {
    const minutes = Math.floor(time / 60000);
    const seconds = ((time % 60000) / 1000).toFixed(0).padStart(2, '0');
    // eslint-disable-next-line sonarjs/no-nested-template-literals
    return `${minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`} `;
  } else if (time instanceof Date) {
    const hours = time.getHours();
    const minutes = time.getMinutes().toFixed(0).padStart(2, '0');
    const seconds = time.getSeconds().toFixed(0).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  } else {
    throw new Error('Cannot format time with this input');
  }
}

export async function print_topic_partitons(client: Pulsar.Client, topic: string): Promise<void> {
  console.log('PARTITIONS =>', await client.getPartitionsForTopic(topic));
}

export function print(str: string): void {
  const now = new Date();

  console.log(
    `
    [${format_time(now)}] -- ${str}
    `
  );
}

export function print_err(str: string): void {
  const now = new Date();

  console.error(
    `
    [${format_time(now)}] -- ${str}
    `
  );
}

export function stringify(obj: object): string {
  return JSON.stringify(obj, null, 2);
}

export function mock_partition_key(consumers_number: number): string {
  return `k-${Math.ceil(Math.random() * consumers_number)}`;
}

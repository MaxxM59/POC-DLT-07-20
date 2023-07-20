/* eslint-disable no-console */
import * as Pulsar from 'pulsar-client';
import { POCConfig } from './interfaces';
// Way to get nack based on % 2
export async function mock_nack(
  message: Pulsar.Message,
  max_redelivery: number,
  ack_on_last_redelivery: boolean
): Promise<boolean> {
  const split = message.getData().toString().split('-');
  if (message.getRedeliveryCount() === max_redelivery && ack_on_last_redelivery) {
    return false;
  } else {
    return parseInt(split[split.length - 1], 10) % 2 !== 0;
  }
}

// Sleep
export async function sleep(ms: number, message?: string): Promise<void> {
  return new Promise(resolve => {
    print(`${message} -- Sleeping for ${ms}ms...`);
    setTimeout(resolve, ms);
  });
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

export async function print_topic_partitons(client: Pulsar.Client, config: POCConfig): Promise<void> {
  console.log('PARTITIONS TOPIC =>', await client.getPartitionsForTopic(config.topic_name));
  console.log('PARTITIONS DLT =>', await client.getPartitionsForTopic(config.consumers.dead_letter.dlq_topic_name));
}

export function print(str: string, function_name?: string): void {
  const now = new Date();

  // eslint-disable-next-line sonarjs/no-nested-template-literals
  console.log(`\n[${format_time(now)}] -- ${function_name !== undefined ? `[${function_name}] -- ` : ''}${str}`);
}

export function print_err(str: string, function_name?: string): void {
  const now = new Date();

  // eslint-disable-next-line sonarjs/no-nested-template-literals
  console.error(`\n[${format_time(now)}] -- ${function_name !== undefined ? `[${function_name}] -- ` : ''}${str}`);
}

export function stringify(obj: object): string {
  return JSON.stringify(obj, null, 2);
}

export function mock_key(consumers_number: number): string {
  return `k-${Math.ceil(Math.random() * consumers_number)}`;
}

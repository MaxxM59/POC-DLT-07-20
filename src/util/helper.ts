/* eslint-disable sonarjs/no-nested-template-literals */
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
export async function sleep(ms: number, function_name: string, message?: string): Promise<void> {
  return new Promise(resolve => {
    print(`${message} -- Sleeping for ${ms}ms...`, function_name);
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

  console.log(
    // eslint-disable-next-line sonarjs/no-nested-template-literals
    `\n[${format_time(now)}] -- ${function_name !== undefined ? `[Function : ${function_name}] -- ` : ''}${str}`
  );
}

export function print_err(str: string, function_name?: string): void {
  const now = new Date();

  console.error(
    // eslint-disable-next-line sonarjs/no-nested-template-literals
    `\n[${format_time(now)}] -- ${function_name !== undefined ? `[Function : ${function_name}] -- ` : ''}${str}`
  );
}

export function stringify(obj: object): string {
  return JSON.stringify(obj, null, 2);
}

export function mock_key(consumers_number: number): string {
  return `k-${Math.round(Math.random() * consumers_number)}`;
}

export async function parse_print(config: POCConfig, consumer_name: string, message: Pulsar.Message): Promise<string> {
  const redelivery_msg = `${
    config.print.receive.redelivery_count
      ? `\n=> Delivery count: ${message.getRedeliveryCount()}/${config.consumers.dead_letter.max_redelivery}`
      : ''
  }`;
  const topic_msg = `${config.print.receive.topic ? `\n=> Topic name: ${message.getTopicName()}` : ''}`;

  const partition_key_msg = `${
    message.getPartitionKey() !== '' && config.print.receive.partitions
      ? `\n=> Partition key: ${message.getPartitionKey()}`
      : ''
  }`;

  const message_id_msg = `${config.print.receive.msg_id ? `\n=> MessageId: ${message.getMessageId()}` : ''}`;

  const publish_timestamp = `${
    config.print.receive.publish_timestamp ? `\n=> PublishTimestamp: ${message.getPublishTimestamp()}` : ''
  }`;

  const event_timestamp = `${
    config.print.receive.event_timestamp ? `\n=> EventTimestamp: ${message.getEventTimestamp()}` : ''
  }`;
  const properties = `${
    config.print.receive.event_timestamp ? `\n=> Properties: ${JSON.stringify(message.getProperties())}` : ''
  }`;

  return `[${consumer_name}] -- Handling message: ${message
    .getData()
    // eslint-disable-next-line max-len
    .toString()}${redelivery_msg}${topic_msg}${partition_key_msg}${message_id_msg}${publish_timestamp}${event_timestamp}${properties}`;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CONFIG, KEYS_CONFIG } from './configs';
import { POCConfig } from './interfaces';
// REGULAR | NEW_SUB | CLOSE_NO_RESUB | CLOSE_RESUB | NACK_NEW_SUB | NACK_CLOSE_NO_RESUB | NACK_CLOSE_RESUB
const mock = CONFIG.NACK_CLOSE_RESUB;
// NO_KEY | ORDER_KEY | PART_KEY | BOTH_KEY
const keys = KEYS_CONFIG.NO_KEY;
const total_messages = 20;
const consumers_number = 3;

export async function parse_env(): Promise<POCConfig> {
  //const topic_name = 'topic1';
  const topic_name = 'POC-topic-partition-0';
  const topic_name_dlq = `${topic_name}-DLQ`;
  //
  // All comments in interfaces.ts
  //
  return {
    topic_name,
    producer: {
      name: 'POC-producer',
      send_timeout_ms: 10000,
      hashing_scheme: 'Murmur3_32Hash',
      routing_mode: 'CustomPartition',
    },
    messages: {
      total_messages: total_messages,
      close_after_messages_sent: false,
      ordering_key: keys.order_key,
      partition_key: keys.partition_key,
    },
    print: {
      receive: {
        enabled: false,
        topic: false,
        partitions: false,
        redelivery_count: true,
        msg_id: true,
        publish_timestamp: false,
        event_timestamp: false,
        properties: false,
      },
      ack_nack: {
        enabled: true,
        redelivery_count: true,
        topic: true,
        partition_key: true,
      },
    },
    consumers: {
      consumers_number: consumers_number,
      ack_timeout: 10000,
      nack_timeout: 1000,

      sub_type: 'KeyShared',
      intial_position: 'Latest',
      dead_letter: {
        max_redelivery: 1,
        dlq_topic_name: topic_name_dlq,
      },
      // Mock config
      mock,
    },
  };
}
// TODO continue at new new sub with order key

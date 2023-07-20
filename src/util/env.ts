import { POCConfig, make_dlq_name } from './helper';

export async function parse_env(): Promise<POCConfig> {
  const topic_name = 'POC-topic-partitioned';
  return {
    topic_name,
    producer: {
      name: 'POC-producer',
      send_timeout_ms: 30000,
      hashing_scheme: 'Murmur3_32Hash',
      routing_mode: 'RoundRobinDistribution',
    },
    messages: {
      total_messages: 5,
      produce_messages_batch: 10,
    },
    consumers: {
      consumers_number: 2,
      ack_timeout: 10000,
      nack_timeout: 1000,
      dead_letter: {
        max_redelivery: 2,
        dlq_topic_name: make_dlq_name(topic_name),
      },
      mock: {
        nack: true,
        add_sub_half: true,
        add_sub_end: true,
        unsub_half: true,
      },
    },
  };
}

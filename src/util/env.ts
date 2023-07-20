import { POCConfig, make_dlq_name } from './helper';

export async function parse_env(): Promise<POCConfig> {
  const topic_name = 'POC-topic-partitioned';
  return {
    producer: {
      topic_name,
      ack_timeout: 10000,
      nack_timeout: 1000,
      max_redelivery: 2,
      dlq_topic_name: make_dlq_name(topic_name),
    },
    messages: {
      total_messages: 5,
      produce_messages_batch: 10,
    },
    consumers: {
      mock_nack: true,
      consumers_number: 2,
    },
  };
}

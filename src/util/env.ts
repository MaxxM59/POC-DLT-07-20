import { POCConfig } from './interfaces';

export async function parse_env(): Promise<POCConfig> {
  const topic_name = 'WS-topic-partitioned-2';
  const topic_name_dlq = `${topic_name}-DLQ`;
  return {
    topic_name,
    producer: {
      name: 'POC-producer',
      send_timeout_ms: 10000,
      //   'Murmur3_32Hash' |  'BoostHash' |  'JavaStringHash';
      hashing_scheme: 'Murmur3_32Hash',
      //   'UseSinglePartition' |  'RoundRobinDistribution' |  'CustomPartition';
      routing_mode: 'UseSinglePartition',
    },
    messages: {
      total_messages: 5,
      close_after_messages_sent: false,
      ordering_key: true,
      partition_key: true,
    },
    consumers: {
      consumers_number: 1,
      // Equal to 0 or >=10000
      ack_timeout: 10000,
      // Mandatory to enable retry
      nack_timeout: 1000,
      //   'Exclusive' |  'Shared' |  'KeyShared' |  'Failover';
      sub_type: 'KeyShared',
      //   'Latest' |  'Earliest' ;
      intial_position: 'Latest',
      // Print topic partitions
      print_partitions: false,
      dead_letter: {
        // (first delivery = 0/max_redelivery)
        max_redelivery: 1,
        dlq_topic_name: topic_name_dlq,
      },
      mock: {
        // Nack messages ending with odd number (eg: message-1)
        nack: true,
        // Acked if redelivery count === dead_letter.max_redelivery
        ack_on_last_redelivery: true,
        // Add new consumer when half messages were sent
        add_sub_half: true,
        // Add new consumer when all messages were sent
        add_sub_end: true,
        // Unsub first consumer when half messages were sent
        unsub_first_consumer_half: true,
        // Close first consumer when half messages were sent
        close_first_consumer_half: false,
        // Reopen consumer when all messages were sent
        reopen_first_consumer_end: true,
        // Mock failover
        mock_failover: false,
      },
    },
  };
}

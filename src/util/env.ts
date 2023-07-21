// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CONFIG } from './configs';
import { POCConfig } from './interfaces';

export async function parse_env(): Promise<POCConfig> {
  const topic_name = 'POC-topic';
  const topic_name_dlq = `${topic_name}-DLQ`;
  const mock = CONFIG.NEW_SUB;

  return {
    topic_name,
    producer: {
      name: 'POC-producer',
      send_timeout_ms: 10000,
      //   'Murmur3_32Hash' |  'BoostHash' |  'JavaStringHash';
      hashing_scheme: 'Murmur3_32Hash',
      //   'UseSinglePartition' |  'RoundRobinDistribution' |  'CustomPartition';
      routing_mode: 'RoundRobinDistribution',
    },
    messages: {
      total_messages: 20,
      close_after_messages_sent: false,
      ordering_key: true,
      partition_key: false,
    },
    print: {
      receive: {
        enabled: false,
        //Print topic name
        topic: false,
        // Print topic partitions
        partitions: false,
        // Print redelivey count
        redelivery_count: true,
        msg_id: true,
        publish_timestamp: false,
        event_timestamp: false,
        // Additional properties
        properties: false,
      },
      ack_nack: {
        enabled: true,
        redelivery_count: true,
        topic: true,
      },
    },
    consumers: {
      consumers_number: 3,
      // Equal to 0 or >=10000
      ack_timeout: 10000,
      // Mandatory to enable retry
      nack_timeout: 1000,
      //   'Exclusive' |  'Shared' |  'KeyShared' |  'Failover';
      sub_type: 'KeyShared',
      //   'Latest' |  'Earliest' ;
      intial_position: 'Latest',
      dead_letter: {
        // (first delivery = 0/max_redelivery)
        max_redelivery: 1,
        dlq_topic_name: topic_name_dlq,
      },
      // Mock config
      mock,
    },
  };
}

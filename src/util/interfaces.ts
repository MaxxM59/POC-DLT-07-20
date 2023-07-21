import * as Pulsar from 'pulsar-client';

export interface SeededConsumer {
  name: string;
  sub_name: string;
  consumer: Pulsar.Consumer;
}
export interface POCConfig {
  topic_name: string;
  print: PrintOptions;
  producer: ProducerConfig;
  messages: MessageConfig;
  consumers: ConsumerConfig;
}

interface ProducerConfig {
  name: string;
  send_timeout_ms: number;
  //   'Murmur3_32Hash' |  'BoostHash' |  'JavaStringHash';
  hashing_scheme: Pulsar.HashingScheme;
  //   'UseSinglePartition' |  'RoundRobinDistribution' |  'CustomPartition';
  routing_mode: Pulsar.MessageRoutingMode;
}

interface MessageConfig {
  total_messages: number;
  close_after_messages_sent: boolean;
  ordering_key: boolean;
  partition_key: boolean;
}

interface PrintOptions {
  receive: {
    enabled: boolean;
    //Print topic name
    topic: boolean;
    // Print topic partitions
    partitions: boolean;
    // Print redelivey count
    redelivery_count: boolean;
    msg_id: boolean;
    publish_timestamp: boolean;
    event_timestamp: boolean;
    // Additional properties
    properties: boolean;
  };
  ack_nack: {
    enabled: boolean;
    redelivery_count: boolean;
    topic: boolean;
    partition_key: boolean;
  };
}
interface ConsumerConfig {
  consumers_number: number;
  // Mandatory to enable retry
  nack_timeout: number;
  // Equal to 0 or >=10000
  ack_timeout: number;
  //   'Exclusive' |  'Shared' |  'KeyShared' |  'Failover';
  sub_type: Pulsar.SubscriptionType;
  //   'Earliest' | 'Latest' | '
  intial_position: Pulsar.InitialPosition;
  dead_letter: {
    dlq_topic_name: string;
    // (first delivery = 0/max_redelivery)
    max_redelivery: number;
  };
  mock: {
    // Nack messages ending with odd number (eg: message-1)
    nack: boolean;
    // Acked if redelivery count === dead_letter.max_redelivery
    ack_on_last_redelivery: boolean;
    // Add new consumer when half messages were sent
    add_sub_half: boolean;
    // Add new consumer when all messages were sent
    add_sub_end: boolean;
    // Unsub first consumer when half messages were sent
    unsub_first_consumer_half: boolean;
    // Close first consumer when half messages were sent
    close_first_consumer_half: boolean;
    // Reopen consumer when half messages were sent
    reopen_first_consumer_half: boolean;
    // Reopen consumer when all messages were sent
    reopen_first_consumer_end: boolean;
    // Mock failover
    mock_failover: boolean;
  };
}

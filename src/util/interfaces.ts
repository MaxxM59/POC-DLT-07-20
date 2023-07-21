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
  hashing_scheme: Pulsar.HashingScheme;
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
    topic: boolean;
    partitions: boolean;
    redelivery_count: boolean;
    msg_id: boolean;
    publish_timestamp: boolean;
    event_timestamp: boolean;
    properties: boolean;
  };
}
interface ConsumerConfig {
  consumers_number: number;
  nack_timeout: number;
  ack_timeout: number;
  sub_type: Pulsar.SubscriptionType;
  intial_position: Pulsar.InitialPosition;

  dead_letter: {
    dlq_topic_name: string;
    max_redelivery: number;
  };
  mock: {
    nack: boolean;
    ack_on_last_redelivery: boolean;
    add_sub_half: boolean;
    add_sub_end: boolean;
    unsub_first_consumer_half: boolean;
    close_first_consumer_half: boolean;
    reopen_first_consumer_half: boolean;
    reopen_first_consumer_end: boolean;
    mock_failover: boolean;
  };
}

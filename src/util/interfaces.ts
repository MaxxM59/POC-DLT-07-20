import * as Pulsar from 'pulsar-client';

export interface SeededConsumer {
  name: string;
  consumer: Pulsar.Consumer;
}
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

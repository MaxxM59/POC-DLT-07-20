const base = {
  nack: false,
  nack_odd: false,
  ack_on_last_redelivery: false,
  add_sub_half: false,
  add_sub_end: false,
  unsub_first_consumer_half: false,
  close_first_consumer_half: false,
  reopen_first_consumer_half: false,
  reopen_first_consumer_end: false,
  mock_failover: false,
};

const nack_base = {
  ...base,
  nack: true,
  nack_odd: false,
  ack_on_last_redelivery: true,
};

export const CONFIG = {
  REGULAR: { ...base },
  NEW_SUB: { ...base, add_sub_half: true },
  CLOSE_NO_RESUB: { ...base, close_first_consumer_half: true },
  CLOSE_RESUB: { ...base, close_first_consumer_half: true, reopen_first_consumer_half: true },
  NACK_NEW_SUB: { ...nack_base, add_sub_half: true },
  NACK_CLOSE_NO_RESUB: {
    ...nack_base,
    close_first_consumer_half: true,
  },
  NACK_CLOSE_RESUB: {
    ...nack_base,
    close_first_consumer_half: true,
    reopen_first_consumer_half: true,
  },
};

export const KEYS_CONFIG = {
  NO_KEY: {
    order_key: false,
    partition_key: false,
  },
  ORDER_KEY: {
    order_key: true,
    partition_key: false,
  },
  PART_KEY: {
    order_key: false,
    partition_key: true,
  },
  BOTH_KEY: {
    order_key: true,
    partition_key: true,
  },
};

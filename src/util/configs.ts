const base = {
  nack: false,
  ack_on_last_redelivery: false,
  add_sub_half: false,
  add_sub_end: false,
  unsub_first_consumer_half: false,
  close_first_consumer_half: false,
  reopen_first_consumer_half: false,
  reopen_first_consumer_end: false,
  mock_failover: false,
};

export const CONFIG = {
  REGULAR: { ...base },
  NEW_SUB: { ...base, add_sub_half: true, add_sub_end: true },
  UNSUB_RESUB: { ...base, unsub_first_consumer_half: true, reopen_first_consumer_half: true },
  CLOSE_RESUB: { ...base, close_first_consumer_half: true, reopen_first_consumer_half: true },
  NACK: {
    NEW_SUB: { ...base, nack: true, ack_on_last_redelivery: true, add_sub_half: true, add_sub_end: true },
    UNSUB_RESUB: {
      ...base,
      nack: true,
      ack_on_last_redelivery: true,
      unsub_first_consumer_half: true,
      reopen_first_consumer_half: true,
    },
    CLOSE_RESUB: {
      ...base,
      nack: true,
      ack_on_last_redelivery: true,
      close_first_consumer_half: true,
      reopen_first_consumer_half: true,
    },
  },
};

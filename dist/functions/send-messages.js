"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "produce_messages", {
    enumerable: true,
    get: function() {
        return produce_messages;
    }
});
const _helper = require("../util/helper");
const _close = require("./close");
const _mock = require("./mock");
async function produce_messages(client, producer, config, consumers) {
    await flush(producer, config);
    for(let i = 1; i <= config.messages.total_messages; i++){
        const msg = `message-${i}`;
        const ordering_key = config.messages.ordering_key ? (0, _helper.mock_key)(config.consumers.consumers_number) : undefined;
        await producer.send({
            data: Buffer.from(msg),
            orderingKey: ordering_key
        });
        (0, _helper.print)(`ORdering key for message : ${msg} => ${ordering_key}`);
        // Mock sub/unsub at half
        if (i === Math.ceil(config.messages.total_messages / 2)) {
            consumers = await (0, _mock.mock_half)(client, config, consumers);
        }
    }
    // Mock sub/unsub at end
    consumers = await (0, _mock.mock_end)(client, config, consumers);
    // Close
    if (config.messages.close_after_messages_sent) {
        await (0, _close.close)(producer, consumers, client);
    }
}
async function flush(producer, config) {
    try {
        (0, _helper.print)(`[${producer.getProducerName()}] Cleaning producer before sending ${config.messages.total_messages} messages`);
        // Assert no msg
        await producer.flush();
    } catch (e) {
        if (e instanceof Error) {
            (0, _helper.print_err)(e.message);
        }
        throw e;
    }
}

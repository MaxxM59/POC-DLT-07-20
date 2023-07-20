"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "handle_message", {
    enumerable: true,
    get: function() {
        return handle_message;
    }
});
const _helper = require("../util/helper");
async function handle_message(message, consumer, consumer_name, config) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (message === null) {
        (0, _helper.print)(`[${consumer_name}] No message !`);
        return;
    }
    (0, _helper.print)(`[${consumer_name}] Handling message: ${message.getData().toString()} 
                            => Delivery count: ${message.getRedeliveryCount()}/${config.consumers.dead_letter.max_redelivery}
                            => Topic name: ${message.getTopicName()}
                            => Partition key: ${message.getPartitionKey()}`);
    // Other properties from current message
    //
    //                        => MessageId: ${message.getMessageId()}
    //                        => PublishTimestamp: ${message.getPublishTimestamp()}
    //                        => EventTimestamp: ${message.getEventTimestamp()}
    //                        => Properties: ${JSON.stringify(message.getProperties())}
    //
    try {
        if (config.consumers.mock.nack && await (0, _helper.mock_nack)(message, config.consumers.dead_letter.max_redelivery, config.consumers.mock.ack_on_last_redelivery)) {
            consumer.negativeAcknowledge(message);
            (0, _helper.print)(`[${consumer_name}] Negative Acknowledged message : ${message.getData().toString()} }`);
        } else {
            await consumer.acknowledge(message);
            (0, _helper.print)(`[${consumer_name}] Acknowledged message : ${message.getData().toString()} }`);
        }
    } catch (e) {
        (0, _helper.print_err)(`[${consumer_name}] Failed to process message ${message.getData().toString()}: ${e}`);
        consumer.negativeAcknowledge(message);
    }
}

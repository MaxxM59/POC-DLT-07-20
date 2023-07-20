"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    init_client: function() {
        return init_client;
    },
    create_producer: function() {
        return create_producer;
    },
    seed_consumers: function() {
        return seed_consumers;
    },
    create_consumer: function() {
        return create_consumer;
    }
});
const _pulsarclient = /*#__PURE__*/ _interop_require_wildcard(require("pulsar-client"));
const _helper = require("../util/helper");
const _receivemessage = require("./receive-message");
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
const CREATE_PRODUCER = 'Create producer';
const CREATE_CONSUMER = 'Create consumer';
async function init_client() {
    return new _pulsarclient.Client({
        serviceUrl: 'pulsar://localhost:6650',
        operationTimeoutSeconds: 30
    });
}
async function create_producer(client, config) {
    const producer_name = 'POC-producer';
    (0, _helper.print)(`Creating producer ${producer_name}`, CREATE_PRODUCER);
    const producer = await client.createProducer({
        topic: config.topic_name,
        producerName: config.producer.name,
        sendTimeoutMs: config.producer.send_timeout_ms,
        hashingScheme: config.producer.hashing_scheme,
        messageRoutingMode: config.producer.routing_mode
    });
    (0, _helper.print)(`Successfully created producer ${producer_name}`, CREATE_PRODUCER);
    return producer;
}
async function seed_consumers(client, config, consumers_number) {
    const CONSUMERS = [];
    for(let i = 1; i <= consumers_number; i++){
        const name = `CONSUMER-${i}`;
        const consumer = await create_consumer(client, config, name);
        CONSUMERS.push(consumer);
    }
    return CONSUMERS;
}
async function create_consumer(client, config, consumer_name) {
    try {
        (0, _helper.print)(`Creating consumer ${consumer_name}`, CREATE_CONSUMER);
        // const sub_name = `POC-subscription-${consumer_name}`;
        //const split = consumer_name.split('-');
        // const topic_name = `${config.topic_name}-partition-${split[split.length - 1]}`;
        const consumer = await client.subscribe({
            ackTimeoutMs: config.consumers.ack_timeout,
            nAckRedeliverTimeoutMs: config.consumers.nack_timeout,
            topic: config.topic_name,
            subscription: 'POC-subscription',
            subscriptionType: config.consumers.sub_type,
            subscriptionInitialPosition: config.consumers.intial_position,
            deadLetterPolicy: {
                deadLetterTopic: config.consumers.dead_letter.dlq_topic_name,
                maxRedeliverCount: config.consumers.dead_letter.max_redelivery,
                initialSubscriptionName: `${config.consumers.dead_letter.dlq_topic_name}-sub`
            },
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            listener: async (message, consumer)=>{
                if (config.consumers.print_partitions) {
                    await (0, _helper.print_topic_partitons)(client, config);
                }
                await (0, _receivemessage.handle_message)(message, consumer, consumer_name, config);
            }
        });
        (0, _helper.print)(`Successfully created consumer ${consumer_name}`, CREATE_CONSUMER);
        return {
            name: consumer_name,
            sub_name: 'POC-subscription',
            consumer: consumer
        };
    } catch (e) {
        (0, _helper.print_err)(`Failed to create consumer ${consumer_name} :  ${e}`, CREATE_CONSUMER);
        throw e;
    }
}

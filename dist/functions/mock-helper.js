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
    add_consumer: function() {
        return add_consumer;
    },
    unsub_first_consumer: function() {
        return unsub_first_consumer;
    },
    close_first_consumer: function() {
        return close_first_consumer;
    },
    resub_first_consumer: function() {
        return resub_first_consumer;
    },
    mock_failover: function() {
        return mock_failover;
    }
});
const _helper = require("../util/helper");
const _seed = require("./seed");
async function add_consumer(client, config, consumers, half) {
    const new_consumer_name = `CONSUMER-${consumers.length + 1}`;
    await (0, _helper.sleep)(2000, `Opening new consumer after ${half ? 'sending 1st half of messages' : 'all messages were sent'} : ${new_consumer_name}`);
    const new_consumer = await (0, _seed.create_consumer)(client, config, new_consumer_name);
    consumers.push(new_consumer);
    return consumers;
}
async function unsub_first_consumer(consumers) {
    await (0, _helper.sleep)(2000, `Unsubscribing ${consumers[0].name} after sending 1st half of messages`);
    await consumers[0].consumer.unsubscribe();
}
async function close_first_consumer(consumers) {
    await (0, _helper.sleep)(2000, `Closing ${consumers[0].name} after sending 1st half of messages`);
    await consumers[0].consumer.close();
}
async function resub_first_consumer(client, config, consumers) {
    await (0, _helper.sleep)(2000, `Reopening ${consumers[0].name} after all messages were sent`);
    await (0, _seed.create_consumer)(client, config, consumers[0].name);
}
async function mock_failover(client, config, consumers, half) {
    await (0, _helper.sleep)(2000, `Mocking failover`);
    consumers = await add_consumer(client, config, consumers, half);
    await unsub_first_consumer(consumers);
    await resub_first_consumer(client, config, consumers);
    await consumers[consumers.length - 1].consumer.unsubscribe();
    return consumers;
}

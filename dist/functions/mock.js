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
    mock_half: function() {
        return mock_half;
    },
    mock_end: function() {
        return mock_end;
    }
});
const _mockhelper = require("./mock-helper");
async function mock_half(client, config, consumers) {
    if (config.consumers.mock.unsub_first_consumer_half && config.consumers.mock.close_first_consumer_half) {
        throw Error(`Cannot unsubscribe and close at the same time`);
    }
    if (config.consumers.mock.unsub_first_consumer_half) {
        await (0, _mockhelper.unsub_first_consumer)(consumers);
    }
    if (config.consumers.mock.close_first_consumer_half) {
        await (0, _mockhelper.close_first_consumer)(consumers);
    }
    if (config.consumers.mock.add_sub_half) {
        consumers = await (0, _mockhelper.add_consumer)(client, config, consumers, true);
    }
    if (config.consumers.mock.mock_failover) {
        consumers = await (0, _mockhelper.mock_failover)(client, config, consumers, true);
    }
    return consumers;
}
async function mock_end(client, config, consumers) {
    if (config.consumers.mock.add_sub_end) {
        consumers = await (0, _mockhelper.add_consumer)(client, config, consumers, false);
    }
    if (config.consumers.mock.reopen_first_consumer_end) {
        await (0, _mockhelper.resub_first_consumer)(client, config, consumers);
    }
    return consumers;
}

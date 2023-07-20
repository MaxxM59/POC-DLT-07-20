/* eslint-disable no-console */ "use strict";
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
    mock_nack: function() {
        return mock_nack;
    },
    sleep: function() {
        return sleep;
    },
    format_time: function() {
        return format_time;
    },
    print_topic_partitons: function() {
        return print_topic_partitons;
    },
    print: function() {
        return print;
    },
    print_err: function() {
        return print_err;
    },
    stringify: function() {
        return stringify;
    },
    mock_key: function() {
        return mock_key;
    }
});
async function mock_nack(message, max_redelivery, ack_on_last_redelivery) {
    const split = message.getData().toString().split('-');
    if (message.getRedeliveryCount() === max_redelivery && ack_on_last_redelivery) {
        return false;
    } else {
        return parseInt(split[split.length - 1], 10) % 2 !== 0;
    }
}
async function sleep(ms, message) {
    return new Promise((resolve)=>{
        print(`${message} -- Sleeping for ${ms}ms...`);
        setTimeout(resolve, ms);
    });
}
function format_time(time) {
    if (typeof time === 'number') {
        const minutes = Math.floor(time / 60000);
        const seconds = (time % 60000 / 1000).toFixed(0).padStart(2, '0');
        // eslint-disable-next-line sonarjs/no-nested-template-literals
        return `${minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`} `;
    } else if (time instanceof Date) {
        const hours = time.getHours();
        const minutes = time.getMinutes().toFixed(0).padStart(2, '0');
        const seconds = time.getSeconds().toFixed(0).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    } else {
        throw new Error('Cannot format time with this input');
    }
}
async function print_topic_partitons(client, config) {
    console.log('PARTITIONS TOPIC =>', await client.getPartitionsForTopic(config.topic_name));
    console.log('PARTITIONS DLT =>', await client.getPartitionsForTopic(config.consumers.dead_letter.dlq_topic_name));
}
function print(str, function_name) {
    const now = new Date();
    console.log(// eslint-disable-next-line sonarjs/no-nested-template-literals
    `\n[${format_time(now)}] -- ${function_name !== undefined ? `Function : [${function_name}] -- ` : ''}${str}`);
}
function print_err(str, function_name) {
    const now = new Date();
    console.error(// eslint-disable-next-line sonarjs/no-nested-template-literals
    `\n[${format_time(now)}] -- ${function_name !== undefined ? `Function : [${function_name}] -- ` : ''}${str}`);
}
function stringify(obj) {
    return JSON.stringify(obj, null, 2);
}
function mock_key(consumers_number) {
    return `k-${Math.round(Math.random() * consumers_number)}`;
}

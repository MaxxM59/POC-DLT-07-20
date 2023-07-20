"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _env = require("./util/env");
const _seed = require("./functions/seed");
const _sendmessages = require("./functions/send-messages");
async function run(client, config) {
    const producer = await (0, _seed.create_producer)(client, config);
    const consumers = await (0, _seed.seed_consumers)(client, config, config.consumers.consumers_number);
    await (0, _sendmessages.produce_messages)(client, producer, config, consumers);
}
void (async ()=>{
    const client = await (0, _seed.init_client)();
    const config = await (0, _env.parse_env)();
    await run(client, config);
})();

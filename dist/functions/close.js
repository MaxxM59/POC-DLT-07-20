"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "close", {
    enumerable: true,
    get: function() {
        return close;
    }
});
const _helper = require("../util/helper");
async function close(producer, consumers, client) {
    await (0, _helper.sleep)(5000, 'Closing app');
    (0, _helper.print)(`Closing instances after 5s`);
    try {
        await producer.flush();
        (0, _helper.print)(`Flushed producer`);
        await producer.close();
        (0, _helper.print)(`Closed producer`);
        await Promise.all(consumers.map(async (c)=>{
            if (c.consumer.isConnected()) {
                await c.consumer.close();
            }
        }));
        (0, _helper.print)(`Closed ${consumers.length > 1 ? 'consumers' : 'consumer'}`);
        await client.close();
        (0, _helper.print)(`Closed client`);
        process.exit(0);
    } catch (e) {
        (0, _helper.print_err)(e);
    }
}

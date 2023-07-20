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
const CLOSE = 'Close';
async function close(producer, consumers, client) {
    await (0, _helper.sleep)(5000, 'Closing app');
    (0, _helper.print)(`Closing instances after 5s`, CLOSE);
    try {
        await producer.flush();
        (0, _helper.print)(`Flushed producer`, CLOSE);
        await producer.close();
        (0, _helper.print)(`Closed producer`, CLOSE);
        await Promise.all(consumers.map(async (c)=>{
            if (c.consumer.isConnected()) {
                await c.consumer.close();
            }
        }));
        (0, _helper.print)(`Closed ${consumers.length > 1 ? 'consumers' : 'consumer'}`, CLOSE);
        await client.close();
        (0, _helper.print)(`Closed client`, CLOSE);
        process.exit(0);
    } catch (e) {
        if (e instanceof Error) {
            (0, _helper.print_err)(e.message, CLOSE);
        } else throw e;
    }
}

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.send_messages = void 0;
var helper_1 = require("../util/helper");
var seed_1 = require("./seed");
function send_messages(client, producer, config, consumers) {
    return __awaiter(this, void 0, void 0, function () {
        var e_1, i, msg, new_consumer_name_1, new_consumer_1, new_consumer_name, new_consumer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    (0, helper_1.print)("[".concat(producer.getProducerName(), "] Cleaning producer before sending ").concat(config.messages.total_messages, " messages"));
                    // Assert no msg
                    return [4 /*yield*/, producer.flush()];
                case 1:
                    // Assert no msg
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _a.sent();
                    (0, helper_1.print_err)(e_1);
                    throw e_1;
                case 3:
                    i = 1;
                    _a.label = 4;
                case 4:
                    if (!(i <= config.messages.total_messages)) return [3 /*break*/, 10];
                    msg = "my-message-".concat(i);
                    return [4 /*yield*/, producer.send({
                            data: Buffer.from(msg),
                            orderingKey: (0, helper_1.mock_partition_key)(config.consumers.consumers_number),
                            partitionKey: (0, helper_1.mock_partition_key)(config.consumers.consumers_number),
                        })];
                case 5:
                    _a.sent();
                    if (!(i === Math.ceil(config.messages.total_messages / 2))) return [3 /*break*/, 9];
                    return [4 /*yield*/, (0, helper_1.sleep)(2000)];
                case 6:
                    _a.sent();
                    (0, helper_1.print)("Closing ".concat(consumers[0].name, " after sending 1st half of messages"));
                    return [4 /*yield*/, consumers[0].consumer.close()];
                case 7:
                    _a.sent();
                    new_consumer_name_1 = "CONSUMER-".concat(consumers.length + 1);
                    (0, helper_1.print)("Opening new consumer after sending 1st half of messages : ".concat(new_consumer_name_1));
                    return [4 /*yield*/, (0, seed_1.create_consumer)(client, config, new_consumer_name_1)];
                case 8:
                    new_consumer_1 = _a.sent();
                    consumers.push({ consumer: new_consumer_1, name: new_consumer_name_1 });
                    _a.label = 9;
                case 9:
                    i++;
                    return [3 /*break*/, 4];
                case 10: return [4 /*yield*/, (0, helper_1.sleep)(2000)];
                case 11:
                    _a.sent();
                    new_consumer_name = "CONSUMER-".concat(consumers.length + 1);
                    (0, helper_1.print)("Opening new consumer after all messages were sent : ".concat(new_consumer_name));
                    return [4 /*yield*/, (0, seed_1.create_consumer)(client, config, new_consumer_name)];
                case 12:
                    new_consumer = _a.sent();
                    (0, helper_1.print)("Opening new consumer after all messages were sent : ".concat(new_consumer_name));
                    consumers.push({ consumer: new_consumer, name: new_consumer_name });
                    return [4 /*yield*/, (0, seed_1.create_consumer)(client, config, new_consumer_name)];
                case 13:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.send_messages = send_messages;

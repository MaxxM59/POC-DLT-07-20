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
exports.close = exports.create_consumer = exports.seed_consumers = exports.create_producer = exports.init_client = void 0;
var Pulsar = require("pulsar-client");
var helper_1 = require("../util/helper");
var receive_message_1 = require("./receive-message");
// Init pulsar client
function init_client() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Pulsar.Client({
                    serviceUrl: 'pulsar://localhost:6650',
                    operationTimeoutSeconds: 30,
                })];
        });
    });
}
exports.init_client = init_client;
// Create producer
function create_producer(client, config) {
    return __awaiter(this, void 0, void 0, function () {
        var producer_name, producer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    producer_name = 'POC-producer';
                    (0, helper_1.print)("Creating producer ".concat(producer_name));
                    return [4 /*yield*/, client.createProducer({
                            topic: config.topic_name,
                            producerName: config.producer.name,
                            sendTimeoutMs: config.producer.send_timeout_ms,
                            hashingScheme: config.producer.hashing_scheme,
                            messageRoutingMode: config.producer.routing_mode,
                        })];
                case 1:
                    producer = _a.sent();
                    (0, helper_1.print)("Successfully created producer ".concat(producer_name));
                    return [2 /*return*/, producer];
            }
        });
    });
}
exports.create_producer = create_producer;
function seed_consumers(client, config, consumers_number) {
    return __awaiter(this, void 0, void 0, function () {
        var CONSUMERS, i, name_1, consumer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    CONSUMERS = [];
                    i = 1;
                    _a.label = 1;
                case 1:
                    if (!(i <= consumers_number)) return [3 /*break*/, 4];
                    name_1 = "CONSUMER-".concat(i);
                    return [4 /*yield*/, create_consumer(client, config, name_1)];
                case 2:
                    consumer = _a.sent();
                    CONSUMERS.push({ name: name_1, consumer: consumer });
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, CONSUMERS];
            }
        });
    });
}
exports.seed_consumers = seed_consumers;
function create_consumer(client, config, consumer_name) {
    return __awaiter(this, void 0, void 0, function () {
        var consumer, e_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    (0, helper_1.print)("Creating consumer ".concat(consumer_name));
                    return [4 /*yield*/, client.subscribe({
                            ackTimeoutMs: config.consumers.ack_timeout,
                            nAckRedeliverTimeoutMs: config.consumers.nack_timeout,
                            topic: config.topic_name,
                            subscription: "POC-subscription-".concat(consumer_name),
                            subscriptionType: 'KeyShared',
                            deadLetterPolicy: {
                                deadLetterTopic: config.consumers.dead_letter.dlq_topic_name,
                                maxRedeliverCount: config.consumers.dead_letter.max_redelivery,
                                initialSubscriptionName: "".concat(config.consumers.dead_letter.dlq_topic_name, "-sub"),
                            },
                            // eslint-disable-next-line @typescript-eslint/no-misused-promises
                            listener: function (message, consumer) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: 
                                        // await print_topic_partitons(client, config.producer.topic_name);
                                        // await print_topic_partitons(client, config.producer.dlq_topic_name);
                                        return [4 /*yield*/, (0, receive_message_1.handle_message)(message, consumer, consumer_name, config)];
                                        case 1:
                                            // await print_topic_partitons(client, config.producer.topic_name);
                                            // await print_topic_partitons(client, config.producer.dlq_topic_name);
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); },
                        })];
                case 1:
                    consumer = _a.sent();
                    (0, helper_1.print)("Successfully created consumer ".concat(consumer_name));
                    return [2 /*return*/, consumer];
                case 2:
                    e_1 = _a.sent();
                    (0, helper_1.print_err)("Failed to create consumer ".concat(consumer_name, " :  ").concat(e_1));
                    throw Error(e_1);
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.create_consumer = create_consumer;
function close(producer, consumers, client) {
    return __awaiter(this, void 0, void 0, function () {
        var e_2;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, producer.flush()];
                case 1:
                    _a.sent();
                    (0, helper_1.print)("Flushed producer");
                    return [4 /*yield*/, producer.close()];
                case 2:
                    _a.sent();
                    (0, helper_1.print)("Closed producer");
                    return [4 /*yield*/, Promise.all(consumers.map(function (c) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, c.consumer.close()];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 3:
                    _a.sent();
                    (0, helper_1.print)("Closed ".concat(consumers.length > 1 ? 'consumers' : 'consumer'));
                    return [4 /*yield*/, client.close()];
                case 4:
                    _a.sent();
                    (0, helper_1.print)("Closed client");
                    return [3 /*break*/, 6];
                case 5:
                    e_2 = _a.sent();
                    (0, helper_1.print_err)(e_2);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.close = close;

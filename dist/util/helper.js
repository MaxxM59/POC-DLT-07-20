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
exports.mock_key = exports.stringify = exports.print_err = exports.print = exports.print_topic_partitons = exports.format_time = exports.sleep = exports.mock_nack = void 0;
// Way to get nack based on % 2
function mock_nack(message, max_redelivery, ack_on_last_redelivery) {
    return __awaiter(this, void 0, void 0, function () {
        var split;
        return __generator(this, function (_a) {
            split = message.getData().toString().split('-');
            if (message.getRedeliveryCount() === max_redelivery && ack_on_last_redelivery) {
                return [2 /*return*/, false];
            }
            else {
                return [2 /*return*/, parseInt(split[split.length - 1], 10) % 2 !== 0];
            }
            return [2 /*return*/];
        });
    });
}
exports.mock_nack = mock_nack;
// Sleep
function sleep(ms, message) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) {
                    print("".concat(message, " -- Sleeping for ").concat(ms, "ms..."));
                    setTimeout(resolve, ms);
                })];
        });
    });
}
exports.sleep = sleep;
function format_time(time) {
    if (typeof time === 'number') {
        var minutes = Math.floor(time / 60000);
        var seconds = ((time % 60000) / 1000).toFixed(0).padStart(2, '0');
        // eslint-disable-next-line sonarjs/no-nested-template-literals
        return "".concat(minutes > 0 ? "".concat(minutes, "m ").concat(seconds, "s") : "".concat(seconds, "s"), " ");
    }
    else if (time instanceof Date) {
        var hours = time.getHours();
        var minutes = time.getMinutes().toFixed(0).padStart(2, '0');
        var seconds = time.getSeconds().toFixed(0).padStart(2, '0');
        return "".concat(hours, ":").concat(minutes, ":").concat(seconds);
    }
    else {
        throw new Error('Cannot format time with this input');
    }
}
exports.format_time = format_time;
function print_topic_partitons(client, config) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    _b = (_a = console).log;
                    _c = ['PARTITIONS TOPIC =>'];
                    return [4 /*yield*/, client.getPartitionsForTopic(config.topic_name)];
                case 1:
                    _b.apply(_a, _c.concat([_g.sent()]));
                    _e = (_d = console).log;
                    _f = ['PARTITIONS DLT =>'];
                    return [4 /*yield*/, client.getPartitionsForTopic(config.consumers.dead_letter.dlq_topic_name)];
                case 2:
                    _e.apply(_d, _f.concat([_g.sent()]));
                    return [2 /*return*/];
            }
        });
    });
}
exports.print_topic_partitons = print_topic_partitons;
function print(str) {
    var now = new Date();
    console.log("\n    [".concat(format_time(now), "] -- ").concat(str, "\n    "));
}
exports.print = print;
function print_err(str) {
    var now = new Date();
    console.error("\n    [".concat(format_time(now), "] -- ").concat(str, "\n    "));
}
exports.print_err = print_err;
function stringify(obj) {
    return JSON.stringify(obj, null, 2);
}
exports.stringify = stringify;
function mock_key(consumers_number) {
    return "k-".concat(Math.ceil(Math.random() * consumers_number));
}
exports.mock_key = mock_key;
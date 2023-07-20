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
exports.handle_message = void 0;
var helper_1 = require("../util/helper");
function handle_message(message, consumer, consumer_name, config) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, e_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                    if (message === null) {
                        (0, helper_1.print)("[".concat(consumer_name, "] No message !"));
                        return [2 /*return*/];
                    }
                    (0, helper_1.print)("[".concat(consumer_name, "] Handling message: ").concat(message.getData().toString(), " \n              => Delivery : ").concat(message.getRedeliveryCount(), "/").concat(config.consumers.dead_letter.max_redelivery, "\n              => Topic: ").concat(message.getTopicName(), "\n              => Partition: ").concat(message.getPartitionKey()));
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 7, , 8]);
                    _a = config.consumers.mock.nack;
                    if (!_a) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, helper_1.mock_nack)(message, config.consumers.dead_letter.max_redelivery)];
                case 2:
                    _a = (_b.sent());
                    _b.label = 3;
                case 3:
                    if (!_a) return [3 /*break*/, 4];
                    consumer.negativeAcknowledge(message);
                    (0, helper_1.print)("[".concat(consumer_name, "] Negative Acknowledged message : ").concat(message.getData().toString(), " }"));
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, consumer.acknowledge(message)];
                case 5:
                    _b.sent();
                    (0, helper_1.print)("[".concat(consumer_name, "] Acknowledged message : ").concat(message.getData().toString(), " }"));
                    _b.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    e_1 = _b.sent();
                    (0, helper_1.print_err)("[".concat(consumer_name, "] Failed to process message ").concat(message.getData().toString(), ": ").concat(e_1));
                    consumer.negativeAcknowledge(message);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.handle_message = handle_message;

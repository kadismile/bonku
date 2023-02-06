"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const winston_transport_1 = tslib_1.__importDefault(require("winston-transport"));
const index_1 = tslib_1.__importStar(require("./index"));
const levelStyleMap = {
    error: index_1.STYLES.ERROR,
    warn: index_1.STYLES.WARN,
    info: index_1.STYLES.INFO,
    verbose: index_1.STYLES.VERBOSE,
    debug: index_1.STYLES.DEBUG,
    silly: index_1.STYLES.SILLY,
};
class ConsoleLogTransport extends winston_transport_1.default {
    constructor() {
        super(...arguments);
        this.logger = new index_1.default();
    }
    log(info, callback) {
        var _a;
        const style = levelStyleMap[info.level] || index_1.STYLES.DEBUG;
        const label = ((_a = info.consoleLoggerOptions) === null || _a === void 0 ? void 0 : _a.label) || info.level.toUpperCase();
        const messages = [info.message];
        if (info.error) {
            messages.push(info.error);
        }
        this.logger.log(style, label, ...messages);
        callback();
    }
}
exports.default = ConsoleLogTransport;

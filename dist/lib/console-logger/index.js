"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LABELS = exports.STYLES = void 0;
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const getTimeStampString = () => new Date(Date.now()).toISOString();
exports.STYLES = {
    ERROR: chalk_1.default.bold.red,
    WARN: chalk_1.default.keyword('orange'),
    INFO: chalk_1.default.hex('#abac72'),
    VERBOSE: chalk_1.default.hex('#6435c9'),
    DEBUG: chalk_1.default.hex('#2185d0'),
    SILLY: chalk_1.default.hex('#f011ce')
};
var LABELS;
(function (LABELS) {
    LABELS["ERROR"] = "ERROR";
    LABELS["WARN"] = "WARN";
    LABELS["INFO"] = "INFO";
    LABELS["VERBOSE"] = "VERBOSE";
    LABELS["DEBUG"] = "DEBUG";
    LABELS["SILLY"] = "SILLY";
})(LABELS = exports.LABELS || (exports.LABELS = {}));
class ConsoleLogger {
    constructor() {
        this.log = (style, label, ...messages) => {
            const finalMessage = `[${getTimeStampString()}] [${label}]`;
            console.log(style(finalMessage, ...(messages.map(item => {
                if (item.stack) {
                    return '\n' + item.stack;
                }
                else if (item.message) {
                    return item.message;
                }
                return item;
            }))));
        };
        this.error = (...messages) => this.log(exports.STYLES.ERROR, LABELS.ERROR, ...messages);
        this.warn = (...messages) => this.log(exports.STYLES.WARN, LABELS.WARN, ...messages);
        this.info = (...messages) => this.log(exports.STYLES.INFO, LABELS.INFO, ...messages);
        this.verbose = (...messages) => this.log(exports.STYLES.VERBOSE, LABELS.VERBOSE, ...messages);
        this.debug = (...messages) => this.log(exports.STYLES.DEBUG, LABELS.DEBUG, ...messages);
        this.silly = (...messages) => this.log(exports.STYLES.SILLY, LABELS.SILLY, ...messages);
    }
}
exports.default = ConsoleLogger;

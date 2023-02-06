"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const winston_1 = require("winston");
const winston_transport_1 = tslib_1.__importDefault(require("./lib/console-logger/winston-transport"));
const logTransports = [
    new winston_1.transports.File({
        level: 'error',
        filename: './logs/error.log',
        format: winston_1.format.json({
            replacer: (key, value) => {
                if (key === 'error') {
                    return {
                        message: value.message,
                        stack: value.stack
                    };
                }
                return value;
            }
        })
    }),
    new winston_transport_1.default()
];
const logger = (0, winston_1.createLogger)({
    format: winston_1.format.combine(winston_1.format.timestamp()),
    transports: logTransports,
    defaultMeta: { service: 'api' },
    level: process.env.NODE_ENV === 'development' ? 'silly' : 'info'
});
exports.default = logger;

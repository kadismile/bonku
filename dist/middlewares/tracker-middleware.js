"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackerMiddleware = void 0;
const tslib_1 = require("tslib");
const randomstring_1 = tslib_1.__importDefault(require("randomstring"));
const trackerMiddleware = (params) => {
    let { originatingFunction } = params;
    originatingFunction = originatingFunction || "";
    const env = process.env.NODE_ENV || 'development';
    return {
        trackID: randomstring_1.default.generate(25),
        env,
        originatingFunction
    };
};
exports.trackerMiddleware = trackerMiddleware;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestMiddleware = void 0;
const tslib_1 = require("tslib");
const bad_request_1 = tslib_1.__importDefault(require("../errors/bad-request"));
const logger_1 = tslib_1.__importDefault(require("../logger"));
const getMessageFromJoiError = (error) => {
    if (!error.details && error.message) {
        return error.message;
    }
    return error.details && error.details.length > 0 && error.details[0].message
        ? `PATH: [${error.details[0].path}] ;; MESSAGE: ${error.details[0].message}`
        : undefined;
};
const requestMiddleware = (handler, options) => async (req, res, next) => {
    var _a, _b, _c, _d;
    if ((_a = options === null || options === void 0 ? void 0 : options.validation) === null || _a === void 0 ? void 0 : _a.body) {
        const { error } = (_b = options === null || options === void 0 ? void 0 : options.validation) === null || _b === void 0 ? void 0 : _b.body.validate(req.body);
        if (error != null) {
            next(new bad_request_1.default(getMessageFromJoiError(error)));
            return;
        }
    }
    if ((_c = options === null || options === void 0 ? void 0 : options.validation) === null || _c === void 0 ? void 0 : _c.query) {
        const { error } = (_d = options === null || options === void 0 ? void 0 : options.validation) === null || _d === void 0 ? void 0 : _d.query.validate(req.query);
        if (error != null) {
            next(new bad_request_1.default(getMessageFromJoiError(error)));
            return;
        }
    }
    try {
        await handler(req, res, next);
        next();
    }
    catch (err) {
        if (process.env.NODE_ENV === 'development') {
            logger_1.default.log({
                level: 'error',
                message: 'Error in request handler',
                error: err,
            });
        }
        next(err);
    }
};
exports.requestMiddleware = requestMiddleware;
exports.default = exports.requestMiddleware;

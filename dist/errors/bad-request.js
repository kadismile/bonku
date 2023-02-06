"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const application_error_1 = tslib_1.__importDefault(require("./application-error"));
class BadRequest extends application_error_1.default {
    constructor(message) {
        super(message || 'Bad request', 400);
    }
}
exports.default = BadRequest;

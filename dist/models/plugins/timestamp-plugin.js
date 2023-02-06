"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const randomstring_1 = tslib_1.__importDefault(require("randomstring"));
const moment_1 = tslib_1.__importDefault(require("moment"));
const TimeStampPlugin = function (schema) {
    schema.add({ _id: { type: String } });
    schema.add({ createdAt: { type: String, index: true } });
    schema.add({ updatedAt: { type: String, index: true } });
    schema.pre('save', function (next) {
        if (this.isNew) {
            this._id = randomstring_1.default.generate(25);
            this.createdAt = (0, moment_1.default)().toISOString();
        }
        this.updatedAt = (0, moment_1.default)().toISOString();
        next();
    });
};
exports.default = TimeStampPlugin;

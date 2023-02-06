"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = require("mongoose");
const timestamp_plugin_1 = tslib_1.__importDefault(require("../plugins/timestamp-plugin"));
const schema = new mongoose_1.Schema({
    userId: {
        type: String,
        ref: 'User',
        required: [true, 'Please Add UserId']
    },
    fullName: {
        type: String,
        required: [true, 'Please Add Full Name']
    },
    phoneNumber: {
        type: String
    },
    tenant: {
        type: String,
        ref: 'Tenant',
    },
    status: {
        type: String,
        required: [true, 'Please Add Status']
    },
}, { versionKey: false });
schema.plugin(timestamp_plugin_1.default);
const UserHistory = (0, mongoose_1.model)('UserHistory', schema);
exports.default = UserHistory;

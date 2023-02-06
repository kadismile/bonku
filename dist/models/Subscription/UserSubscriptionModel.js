"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = require("mongoose");
const timestamp_plugin_1 = tslib_1.__importDefault(require("../plugins/timestamp-plugin"));
const schema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Please Add Subscription Name']
    },
    amount: {
        type: String,
        required: [true, 'Please Add Subscription Amount']
    },
    expiry: {
        type: String,
        required: [true, 'Please Add Full Name']
    },
    isActive: {
        type: Boolean,
        default: function () {
            return true;
        }
    },
    userId: {
        type: String,
        optional: true,
    },
}, { versionKey: false });
schema.plugin(timestamp_plugin_1.default);
schema.pre('findOne', async function () {
    this.where({ isActive: true });
});
schema.pre('find', async function () {
    this.where({ isActive: true });
});
const UserSubscription = (0, mongoose_1.model)('UserSubscription', schema);
exports.default = UserSubscription;

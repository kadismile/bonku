"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = require("mongoose");
const timestamp_plugin_1 = tslib_1.__importDefault(require("../plugins/timestamp-plugin"));
const subscription_after_update_1 = tslib_1.__importDefault(require("./subscription_after_update"));
const subscription_before_save_1 = tslib_1.__importDefault(require("./subscription_before_save"));
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
    history: {
        type: Array,
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
schema.pre('findOneAndUpdate', async function (next) {
    await (0, subscription_after_update_1.default)(this, next);
});
schema.pre("save", async function (_next) {
    await (0, subscription_before_save_1.default)(this);
});
const Subscription = (0, mongoose_1.model)('Subscription', schema);
exports.default = Subscription;

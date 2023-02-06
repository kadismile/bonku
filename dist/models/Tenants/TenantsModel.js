"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = require("mongoose");
const timestamp_plugin_1 = tslib_1.__importDefault(require("../plugins/timestamp-plugin"));
const tenant_before_save_1 = tslib_1.__importDefault(require("./tenant_before_save"));
const tenant_after_update_1 = tslib_1.__importDefault(require("./tenant_after_update"));
const schema = new mongoose_1.Schema({
    email: {
        type: String,
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ],
        required: [true, 'Please Add Email']
    },
    businessName: {
        type: String,
        required: [true, 'Please Add Full Name']
    },
    businessAddress: {
        type: Object,
        required: [true, 'Please add a business address']
    },
    phoneNumber: {
        type: String
    },
    tenantNumber: {
        type: Number,
        default: 1000,
        optional: true,
    },
    user: {
        type: String,
        ref: 'User',
        required: [true, "kindly provide a a userId"]
    },
    accountBalance: {
        type: Number,
        default: function () {
            return 0.0;
        }
    },
    history: {
        type: Array,
        optional: true,
    },
    isActive: {
        type: Boolean,
        default: function () {
            return true;
        }
    },
    isVerified: {
        type: Boolean,
        default: function () {
            return false;
        }
    },
    attachments: [{
            type: String,
            ref: 'Attachment'
        }],
    loginToken: {
        type: String,
        optional: true,
    }
}, { versionKey: false });
schema.plugin(timestamp_plugin_1.default);
schema.pre('findOne', async function () {
    this.where({ isActive: true });
});
schema.pre('find', async function () {
    this.where({ isActive: true });
});
schema.pre('findOneAndUpdate', async function (next) {
    await (0, tenant_after_update_1.default)(this, next);
});
schema.pre("save", async function (_next) {
    await (0, tenant_before_save_1.default)(this);
});
const Tenant = (0, mongoose_1.model)('Tenant', schema);
exports.default = Tenant;

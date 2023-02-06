"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = require("mongoose");
const timestamp_plugin_1 = tslib_1.__importDefault(require("../plugins/timestamp-plugin"));
const user_after_update_1 = tslib_1.__importDefault(require("./user_after_update"));
const user_before_save_1 = tslib_1.__importDefault(require("./user_before_save"));
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
    fullName: {
        type: String,
        required: [true, 'Please Add Full Name']
    },
    phoneNumber: {
        type: String,
        required: [true, 'Please Add Phone Number']
    },
    age: {
        type: String,
        required: [true, 'Please Add Your Age']
    },
    sex: {
        type: String,
        enum: ['Male', 'Female'],
        required: [true, 'Please Add Gender']
    },
    weight: {
        type: String,
        required: [true, 'Please Add Your weight in Kg']
    },
    userNumber: {
        type: Number,
        default: 1000,
        optional: true,
    },
    userType: {
        type: String,
        enum: ['customer', 'tenantAdmin'],
        default: 'user'
    },
    tenant: {
        type: String,
        ref: 'Tenant',
    },
    accountBalance: {
        type: Number,
        default: function () {
            return 0.0;
        }
    },
    address: {
        type: Object,
        required: [true, 'Please add an address']
    },
    password: {
        type: String,
        select: false,
    },
    fingerPrintId: {
        type: String,
        optional: true,
    },
    resetPasswordToken: {
        type: String,
        optional: true,
    },
    resetPasswordExpire: {
        type: Date,
        optional: true,
    },
    verifyEmailToken: {
        type: String,
        optional: true,
    },
    roles: {
        type: Array,
        default: [],
        optional: true,
    },
    history: {
        type: Array,
        optional: true,
    },
    superAdmin: {
        type: Boolean,
        default: function () {
            return false;
        }
    },
    isAdmin: {
        type: Boolean,
        default: function () {
            return false;
        }
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
    await (0, user_after_update_1.default)(this, next);
});
schema.pre("save", async function (_next) {
    await (0, user_before_save_1.default)(this);
});
const User = (0, mongoose_1.model)('User', schema);
exports.default = User;

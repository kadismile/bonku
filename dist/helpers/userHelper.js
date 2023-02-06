"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSignedJwtToken = exports.matchPassword = exports.findUserByEmailOrPhone = void 0;
const tslib_1 = require("tslib");
const UsersModel_1 = tslib_1.__importDefault(require("../models/Users/UsersModel"));
const bcryptjs_1 = tslib_1.__importDefault(require("bcryptjs"));
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const findUserByEmailOrPhone = async (phoneNumber, email) => {
    if (phoneNumber === null || phoneNumber === void 0 ? void 0 : phoneNumber.startsWith('0')) {
        phoneNumber = '+234' + phoneNumber.split('').splice(1).join('');
    }
    const user = await UsersModel_1.default.findOne({
        $or: [{ email }, { phoneNumber }],
    }).select('+password');
    if (!user) {
        return null;
    }
    return user;
};
exports.findUserByEmailOrPhone = findUserByEmailOrPhone;
const matchPassword = async (enteredPassword, userPassword) => {
    return await bcryptjs_1.default.compare(enteredPassword, userPassword);
};
exports.matchPassword = matchPassword;
const getSignedJwtToken = async (user) => {
    const JWT_SECRET = process.env.JWT_SECRET || '';
    return jsonwebtoken_1.default.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};
exports.getSignedJwtToken = getSignedJwtToken;

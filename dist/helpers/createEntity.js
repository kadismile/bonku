"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserHistory = exports.createUserHelper = void 0;
const tslib_1 = require("tslib");
const UsersModel_1 = tslib_1.__importDefault(require("../models/Users/UsersModel"));
const prepareValidPhoneNumber_1 = tslib_1.__importDefault(require("./prepareValidPhoneNumber"));
const UserHistoryModel_1 = tslib_1.__importDefault(require("../models/Users/UserHistoryModel"));
const createUserHelper = async (params) => {
    const body = {
        fullName: params.fullName,
        age: params.age,
        weight: params.weight,
        sex: params.sex,
        password: params.password,
        fingerPrintId: params.fingerPrintId,
        userType: params.userType,
        email: params.email,
        address: params.address,
        tenant: params.tenantId
    };
    const phoneNumber = (0, prepareValidPhoneNumber_1.default)(params.address);
    const user = new UsersModel_1.default({ ...body, phoneNumber });
    await user.save();
    return user;
};
exports.createUserHelper = createUserHelper;
const createUserHistory = async (params) => {
    const userHistory = new UserHistoryModel_1.default({
        userId: params._id,
        tenant: params.tenantId,
        fullName: params.fullName,
        phoneNumber: params.phoneNumber,
        status: 'SUCCESSFUL',
    });
    await userHistory.save();
    return userHistory;
};
exports.createUserHistory = createUserHistory;

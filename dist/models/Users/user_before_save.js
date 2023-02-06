"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const bcryptjs_1 = tslib_1.__importDefault(require("bcryptjs"));
const UsersModel_1 = tslib_1.__importDefault(require("./UsersModel"));
const application_error_1 = tslib_1.__importDefault(require("../../errors/application-error"));
const UserBeforeSave = async (doc) => {
    const userByPhone = await UsersModel_1.default.findOne({ phoneNumber: doc.phoneNumber });
    const userByEmail = await UsersModel_1.default.findOne({ email: doc.email });
    if (userByPhone)
        throw new application_error_1.default(`User with phone-number ${doc.phoneNumber} already exist`, 406);
    if (userByEmail)
        throw new application_error_1.default(`User with Email ${doc.email} already exist`, 406);
    if (doc.password) {
        const salt = await bcryptjs_1.default.genSalt(10);
        doc.password = await bcryptjs_1.default.hash(doc.password, salt);
        doc.isActive = true;
    }
    if (doc.userType === "customer") {
        doc.userNumber = await getNextSequenceValue();
    }
    return doc;
};
const getNextSequenceValue = async () => {
    let user = await UsersModel_1.default.findOne({}, {}, { sort: { createdAt: -1 } });
    if (!user) {
        return 1000;
    }
    else {
        return user.userNumber += 1;
    }
};
exports.default = UserBeforeSave;

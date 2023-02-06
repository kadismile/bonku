"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const PNF = require('google-libphonenumber').PhoneNumberFormat;
const PhoneNumberUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
const application_error_1 = tslib_1.__importDefault(require("../errors/application-error"));
const prepareValidPhoneNumber = (address) => {
    if (!isValidPhoneNumber(address)) {
        throw new application_error_1.default(`An invalid phone number ${address.phoneNumber} was provided`, 406);
    }
    return preparePhoneNumber(address);
};
const preparePhoneNumber = (address) => {
    const phoneUtil = PhoneNumberUtil;
    const countryCode = address.countryCode;
    const phone = phoneUtil.parse(address.phoneNumber, countryCode);
    if (phoneUtil.isValidNumber(phone)) {
        return phoneUtil.format(phone, PNF.E164);
    }
    else {
        return false;
    }
};
const isValidPhoneNumber = (address) => {
    const phoneUtil = PhoneNumberUtil;
    const countryCode = address.countryCode;
    const phone = phoneUtil.parse(address.phoneNumber, countryCode);
    return phoneUtil.isValidNumber(phone);
};
exports.default = prepareValidPhoneNumber;

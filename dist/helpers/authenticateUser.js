"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = void 0;
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
const authenticateUser = async (doc) => {
    const { email, password, vendor } = doc;
    let response;
    try {
        const DOMAIN_URL = process.env.DOMAIN_URL;
        const urlParams = vendor ? 'api/v1/vendors/login' : 'api/v1/users/login';
        const resp = await (0, axios_1.default)({
            method: 'post',
            url: `${DOMAIN_URL}/${urlParams}`,
            data: { email, password }
        });
        response = resp.data;
    }
    catch (err) {
        response = err.response.data;
    }
    response === null || response === void 0 ? true : delete response.status;
    return response;
};
exports.authenticateUser = authenticateUser;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const index_1 = tslib_1.__importDefault(require("./index"));
const tenant_routes_1 = tslib_1.__importDefault(require("./tenant_routes"));
const auth_routes_1 = tslib_1.__importDefault(require("./auth_routes"));
const subscription_routes_1 = tslib_1.__importDefault(require("./subscription_routes"));
module.exports = [
    ['/', index_1.default],
    ['/api/v1/tenants', tenant_routes_1.default],
    ['/api/v1/users', auth_routes_1.default],
    ['/api/v1/auth', auth_routes_1.default],
    ['/api/v1/subscriptions', subscription_routes_1.default],
];

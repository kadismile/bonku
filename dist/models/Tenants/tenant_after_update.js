"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const TenantsModel_1 = tslib_1.__importDefault(require("./TenantsModel"));
const TenantAfterUpdate = async (model, _next) => {
    const oldDoc = await TenantsModel_1.default.findById(model._conditions._id);
    const newDoc = model._update;
    console.log(oldDoc, newDoc);
};
exports.default = TenantAfterUpdate;

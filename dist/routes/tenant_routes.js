"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const tenantController = tslib_1.__importStar(require("../controllers/tenantController"));
const tenant_routes = (0, express_1.Router)();
tenant_routes.post('/create', tenantController.createTenants);
exports.default = tenant_routes;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const subController = tslib_1.__importStar(require("../controllers/subscriptionsController"));
const sub_routes = (0, express_1.Router)();
sub_routes.post('/', subController.manageSubscriptions);
sub_routes.get('/', subController.get_subscriptions);
exports.default = sub_routes;

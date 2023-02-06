"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subSchema = void 0;
const tslib_1 = require("tslib");
const joi_1 = tslib_1.__importDefault(require("@hapi/joi"));
const SubscriptionModel_1 = tslib_1.__importDefault(require("../../models/Subscription/SubscriptionModel"));
const advancedResults_1 = require("../../helpers/advancedResults");
const request_middleware_1 = tslib_1.__importDefault(require("../../middlewares/request-middleware"));
exports.subSchema = joi_1.default.object().keys({
    in: joi_1.default.string(),
    gt: joi_1.default.string(),
    gte: joi_1.default.string(),
    lt: joi_1.default.string(),
    lte: joi_1.default.string(),
});
const get_subscriptions = async (req, res) => {
    let subscription = await (0, advancedResults_1.advancedResults)(req, SubscriptionModel_1.default, []);
    if (subscription === null || subscription === void 0 ? void 0 : subscription.data) {
        res.status(200).json({
            status: "success",
            data: subscription
        });
    }
};
exports.default = (0, request_middleware_1.default)(get_subscriptions, { validation: { query: exports.subSchema } });

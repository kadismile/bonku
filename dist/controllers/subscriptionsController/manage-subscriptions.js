"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionSchema = void 0;
const tslib_1 = require("tslib");
const joi_1 = tslib_1.__importDefault(require("@hapi/joi"));
const logger_1 = tslib_1.__importDefault(require("../../logger"));
const request_middleware_1 = tslib_1.__importDefault(require("../../middlewares/request-middleware"));
const SubscriptionModel_1 = tslib_1.__importDefault(require("../../models/Subscription/SubscriptionModel"));
exports.subscriptionSchema = joi_1.default.object().keys({
    name: joi_1.default.string(),
    amount: joi_1.default.string(),
    id: joi_1.default.string(),
    expiry: joi_1.default.string(),
    action: joi_1.default.string().valid(...['update', 'create', 'delete', 'read']).required(),
});
const manage_subscription = async (req, res) => {
    let doc = req.body;
    const { action, name, expiry, id, amount } = doc;
    try {
        if (action === 'create') {
            const subscription = new SubscriptionModel_1.default({ name, expiry, amount });
            await subscription.save();
            res.status(201).json({
                status: "success",
                data: subscription === null || subscription === void 0 ? void 0 : subscription.toJSON(),
            });
        }
        if (action === 'delete' || action === 'update') {
            const foundSub = await SubscriptionModel_1.default.findById(id);
            if (foundSub) {
                if (action === 'delete') {
                    await SubscriptionModel_1.default.findByIdAndUpdate(id, { isActive: false });
                    res.status(200).json({
                        status: "success",
                        message: 'subscription successfully deleted',
                    });
                }
                else {
                    await SubscriptionModel_1.default.findByIdAndUpdate(id, { name, expiry, amount });
                    const updatedSub = await SubscriptionModel_1.default.findById(id);
                    res.status(200).json({
                        status: "success",
                        data: {
                            data: updatedSub === null || updatedSub === void 0 ? void 0 : updatedSub.toJSON(),
                        }
                    });
                }
            }
            else {
                res.status(404).json({
                    status: 'failed',
                    message: 'couldnt find a subscription'
                });
            }
        }
    }
    catch (e) {
        logger_1.default.log({
            level: 'debug',
            message: e.message,
            consoleLoggerOptions: { label: 'API' },
        });
        res.status(403).json({
            status: "failed",
            message: e.message
        });
    }
};
exports.default = (0, request_middleware_1.default)(manage_subscription, { validation: { body: exports.subscriptionSchema } });

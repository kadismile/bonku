"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUserSchema = void 0;
const tslib_1 = require("tslib");
const joi_1 = tslib_1.__importDefault(require("@hapi/joi"));
const request_middleware_1 = tslib_1.__importDefault(require("../../middlewares/request-middleware"));
const createEntity_1 = require("../../helpers/createEntity");
const TenantsModel_1 = tslib_1.__importDefault(require("../../models/Tenants/TenantsModel"));
const SubscriptionModel_1 = tslib_1.__importDefault(require("../../models/Subscription/SubscriptionModel"));
const UserSubscriptionModel_1 = tslib_1.__importDefault(require("../../models/Subscription/UserSubscriptionModel"));
const twilio_1 = require("../../integrations/twilio");
exports.addUserSchema = joi_1.default.object().keys({
    tenant: joi_1.default.string().required(),
    fullName: joi_1.default.string().required(),
    age: joi_1.default.string().required(),
    sex: joi_1.default.string().valid(...['Male', 'Female']).required(),
    weight: joi_1.default.string().required(),
    fingerPrintId: joi_1.default.string().required(),
    password: joi_1.default.string().min(6).max(50).required(),
    phoneNumber: joi_1.default.string().required(),
    subscriptionId: joi_1.default.string().required(),
    userType: joi_1.default.string().valid(...['customer', 'tenantAdmin']).required(),
    email: joi_1.default.string().required().email({ tlds: { allow: false } }),
    address: joi_1.default.object({
        country: joi_1.default.string().required(),
        fullAddress: joi_1.default.string().required(),
        landMark: joi_1.default.string(),
        city: joi_1.default.string(),
        state: joi_1.default.string(),
        countryCode: joi_1.default.string().required(),
        longitude: joi_1.default.string().required(),
        latitude: joi_1.default.string().required(),
    }).required(),
});
const create_user = async (req, res) => {
    let doc = req.body;
    const tenant = await TenantsModel_1.default.findById(doc.tenant);
    if (tenant) {
        try {
            const params = {
                fullName: doc.fullName,
                age: doc.age,
                sex: doc.sex,
                weight: doc.weight,
                password: doc.password,
                fingerPrintId: doc.fingerPrintId,
                phoneNumber: doc.phoneNumber,
                userType: doc.userType,
                email: doc.email,
                tenantId: tenant._id,
                address: { ...doc.address, phoneNumber: doc.phoneNumber }
            };
            const user = await (0, createEntity_1.createUserHelper)(params);
            if (user && user.userType === 'customer') {
                const subscription = await SubscriptionModel_1.default.findById(doc.subscriptionId);
                if (subscription) {
                    const userSubscription = new UserSubscriptionModel_1.default({
                        name: subscription.name,
                        userId: user._id,
                        amount: subscription.amount,
                        expiry: subscription.expiry,
                        isActive: subscription.isActive,
                    });
                    await userSubscription.save();
                }
                await (0, twilio_1.sendWhatsappMessage)(tenant, user);
            }
            res.send({
                status: "success",
                data: { user }
            });
        }
        catch (e) {
            res.status(400).json({
                status: "failed",
                message: e.message
            });
        }
    }
    else {
        res.status(404).json({
            status: "failed",
            message: 'Tenant not found'
        });
    }
};
exports.default = (0, request_middleware_1.default)(create_user, { validation: { body: exports.addUserSchema } });

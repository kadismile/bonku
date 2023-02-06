"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWhatsappMessage = void 0;
const tslib_1 = require("tslib");
const UserSubscriptionModel_1 = tslib_1.__importDefault(require("../models/Subscription/UserSubscriptionModel"));
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const sendWhatsappMessage = async (tenant, user) => {
    const subcription = await UserSubscriptionModel_1.default.findOne({ userId: user._id });
    client.messages
        .create({
        from: `whatsapp:${tenant.phoneNumber}`,
        body: `Hello ${user.fullName}, Welcome to ${tenant.businessName}, your user number is ${user.userNumber} and you have just subscribed to a ${subcription === null || subcription === void 0 ? void 0 : subcription.name} subscription plan `,
        to: `whatsapp:${user.phoneNumber}`
    })
        .then((message) => console.log("MESSAGE =======================", message.sid));
};
exports.sendWhatsappMessage = sendWhatsappMessage;

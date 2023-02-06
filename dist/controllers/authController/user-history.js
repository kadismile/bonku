"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userHistorySchema = void 0;
const tslib_1 = require("tslib");
const joi_1 = tslib_1.__importDefault(require("@hapi/joi"));
const request_middleware_1 = tslib_1.__importDefault(require("../../middlewares/request-middleware"));
const application_error_1 = tslib_1.__importDefault(require("../../errors/application-error"));
const UsersModel_1 = tslib_1.__importDefault(require("../../models/Users/UsersModel"));
const UserHistoryModel_1 = tslib_1.__importDefault(require("../../models/Users/UserHistoryModel"));
const moment_1 = tslib_1.__importDefault(require("moment"));
exports.userHistorySchema = joi_1.default.object().keys({
    userId: joi_1.default.string(),
    tenantId: joi_1.default.string()
});
const user_history = async (req, res) => {
    let { userId } = req.query;
    if (!userId) {
        res.status(400).send({
            status: "failed",
            error: "false"
        });
    }
    if (userId) {
        try {
            const user = await UsersModel_1.default.findById(userId);
            if (user) {
                const userHistory = await UserHistoryModel_1.default.find({ userId });
                let data = userHistory.map((uh) => {
                    return {
                        name: uh.fullName,
                        phoneNumber: uh.phoneNumber,
                        loggedInAt: (0, moment_1.default)(uh.createdAt).format('MMMM D, YYYY, h:mma')
                    };
                });
                res.status(200).json({
                    status: "success",
                    attempts: data.length,
                    data
                });
            }
            else {
                res.status(404).send(`User not found with Id ${userId}`);
            }
        }
        catch (e) {
            throw new application_error_1.default(e.message, 500);
        }
    }
};
exports.default = (0, request_middleware_1.default)(user_history, { validation: { query: exports.userHistorySchema } });

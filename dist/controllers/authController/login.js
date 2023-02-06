"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginSchema = void 0;
const tslib_1 = require("tslib");
const joi_1 = tslib_1.__importDefault(require("@hapi/joi"));
const request_middleware_1 = tslib_1.__importDefault(require("../../middlewares/request-middleware"));
const application_error_1 = tslib_1.__importDefault(require("../../errors/application-error"));
const userHelper_1 = require("../../helpers/userHelper");
exports.LoginSchema = joi_1.default.object().keys({
    password: joi_1.default.string().required(),
    phoneNumber: joi_1.default.string(),
    isAdmin: joi_1.default.boolean(),
    email: joi_1.default.string().email({ tlds: { allow: false } }),
});
const login = async (req, res) => {
    let { email, phoneNumber, password } = req.body;
    if (!email && !phoneNumber) {
        res.status(400).json({
            status: "failed",
            error: "Please Login with  your phone-number or email"
        });
    }
    if (phoneNumber || email) {
        try {
            const user = await (0, userHelper_1.findUserByEmailOrPhone)(phoneNumber, email);
            const isMatch = await (0, userHelper_1.matchPassword)(password, user.password);
            if (!isMatch) {
                res.status(401).json({
                    status: "failed",
                    data: "this user is not currently registered"
                });
            }
            else {
                const token = (0, userHelper_1.getSignedJwtToken)(user);
                res.status(200).json({
                    status: "success",
                    token,
                    user
                });
            }
        }
        catch (e) {
            throw new application_error_1.default(e.message, 500);
        }
    }
};
exports.default = (0, request_middleware_1.default)(login, { validation: { body: exports.LoginSchema } });

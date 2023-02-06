"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginSchema = void 0;
const tslib_1 = require("tslib");
const joi_1 = tslib_1.__importDefault(require("@hapi/joi"));
const request_middleware_1 = tslib_1.__importDefault(require("../../middlewares/request-middleware"));
const application_error_1 = tslib_1.__importDefault(require("../../errors/application-error"));
const UsersModel_1 = tslib_1.__importDefault(require("../../models/Users/UsersModel"));
const createEntity_1 = require("../../helpers/createEntity");
exports.LoginSchema = joi_1.default.object().keys({
    userId: joi_1.default.string(),
    tenantId: joi_1.default.string()
});
const access_door = async (req, res) => {
    let { userId, } = req.query;
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
                await (0, createEntity_1.createUserHistory)(user);
                res.status(200).send('SUCCESSFUL');
            }
            else {
                res.status(404).send('UNSUCCESSFUL');
            }
        }
        catch (e) {
            throw new application_error_1.default(e.message, 500);
        }
    }
};
exports.default = (0, request_middleware_1.default)(access_door, { validation: { query: exports.LoginSchema } });

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTenantSchema = void 0;
const tslib_1 = require("tslib");
const joi_1 = tslib_1.__importDefault(require("@hapi/joi"));
const logger_1 = tslib_1.__importDefault(require("../../logger"));
const request_middleware_1 = tslib_1.__importDefault(require("../../middlewares/request-middleware"));
const createEntity_1 = require("../../helpers/createEntity");
const TenantsModel_1 = tslib_1.__importDefault(require("../../models/Tenants/TenantsModel"));
const UsersModel_1 = tslib_1.__importDefault(require("../../models/Users/UsersModel"));
exports.addTenantSchema = joi_1.default.object().keys({
    email: joi_1.default.string().required().email({ tlds: { allow: false } }),
    password: joi_1.default.string().min(6).max(50).required(),
    phoneNumber: joi_1.default.string().required(),
    userType: joi_1.default.string().valid(...['customer', 'tenantAdmin']).required(),
    businessName: joi_1.default.string().required(),
    businessOwner: joi_1.default.string().required(),
    businessAddress: joi_1.default.object({
        country: joi_1.default.string().required(),
        landMark: joi_1.default.string().required(),
        city: joi_1.default.string().required(),
        state: joi_1.default.string().required(),
        fullAddress: joi_1.default.string().required(),
        countryCode: joi_1.default.string().required(),
        longitude: joi_1.default.string().required(),
        latitude: joi_1.default.string().required(),
    }).required(),
});
const create_tenant = async (req, res) => {
    let doc = req.body;
    try {
        const params = {
            fullName: doc.businessName,
            password: doc.password,
            phoneNumber: doc.phoneNumber,
            userType: doc.userType,
            email: doc.email,
            address: { ...doc.businessAddress, phoneNumber: doc.phoneNumber },
            age: "50",
            weight: "90kg",
            sex: "Female"
        };
        let newUser = await (0, createEntity_1.createUserHelper)(params);
        if (!newUser) {
            res.status(403).json({
                status: 'newUser.status',
                message: `User couldnt be created for Tenant ${doc.businessName}`
            });
        }
        if (newUser.email) {
            req.body.user = newUser._id;
            const tenant = new TenantsModel_1.default(req.body);
            await tenant.save();
            const user = await UsersModel_1.default.findByIdAndUpdate(newUser._id, { tenant: tenant._id }, {
                new: true,
                runValidators: true,
                useFindAndModify: false
            });
            res.status(201).json({
                status: "success",
                data: {
                    tenant: tenant.toJSON(),
                    user
                }
            });
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
exports.default = (0, request_middleware_1.default)(create_tenant, { validation: { body: exports.addTenantSchema } });

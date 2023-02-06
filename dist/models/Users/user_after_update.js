"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const bcryptjs_1 = tslib_1.__importDefault(require("bcryptjs"));
const UsersModel_1 = tslib_1.__importDefault(require("./UsersModel"));
const UserAfterUpdate = async (model, next) => {
    const oldDoc = await UsersModel_1.default.findById(model._conditions._id);
    const newDoc = model._update;
    if (newDoc.fullName && oldDoc.fullName !== newDoc.fullName) {
        try {
            await UsersModel_1.default.updateOne({ _id: oldDoc._id }, { $addToSet: { history: {
                        event: "NAME_CHANGE",
                        oldValue: oldDoc.fullName,
                        newValue: newDoc.fullName,
                        createdAt: new Date()
                    } } });
        }
        catch (e) {
            return next(e);
        }
    }
    if (newDoc.address && addressChanged(oldDoc.address, newDoc.address)) {
        try {
            await UsersModel_1.default.updateOne({ _id: oldDoc._id }, { $addToSet: { history: {
                        event: "ADDRESS_CHANGE",
                        oldValue: oldDoc.address,
                        newValue: newDoc.address,
                        createdAt: new Date()
                    } }
            });
        }
        catch (e) {
            return next(e);
        }
    }
    if (newDoc.password && oldDoc.password !== newDoc.password) {
        try {
            const salt = await bcryptjs_1.default.genSalt(10);
            newDoc.password = await bcryptjs_1.default.hash(newDoc.password, salt);
            await UsersModel_1.default.updateOne({ _id: oldDoc._id }, {
                password: newDoc.password,
                $addToSet: {
                    history: {
                        event: "PASSWORD_CHANGE",
                        createdAt: new Date()
                    }
                }
            });
        }
        catch (e) {
            return next(e);
        }
    }
};
const addressChanged = (oldDAddress, newAddress) => {
    let oldValues = Object.values(oldDAddress);
    let newValues = Object.values(newAddress);
    let change = false;
    for (let i = 0; i < oldValues.length; i++) {
        change = oldValues.includes(newValues[i]);
    }
    return change;
};
exports.default = UserAfterUpdate;

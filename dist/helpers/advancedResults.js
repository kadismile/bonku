"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.advancedResults = void 0;
const tslib_1 = require("tslib");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const moment_1 = tslib_1.__importDefault(require("moment"));
const perf_hooks_1 = require("perf_hooks");
const application_error_1 = tslib_1.__importDefault(require("../errors/application-error"));
const advancedResults = async (req, model, populate) => {
    var _a;
    try {
        let query, queryStr;
        const reqQuery = { ...req.query };
        const t0 = perf_hooks_1.performance.now();
        const removeFields = ['select', 'sort', 'limit'];
        removeFields.forEach((param) => delete reqQuery[param]);
        if ((_a = reqQuery.field) === null || _a === void 0 ? void 0 : _a.length) {
            let { gt, gte, lt, lte } = reqQuery;
            if (!gt || !gte || !lt || !lte || !reqQuery.in) {
                throw new application_error_1.default('kindly add a gt, gte, lt, lte in your query params');
            }
            let key = reqQuery.field;
            let iin = reqQuery === null || reqQuery === void 0 ? void 0 : reqQuery.in;
            delete reqQuery.field;
            reqQuery === null || reqQuery === void 0 ? true : delete reqQuery.page;
            reqQuery === null || reqQuery === void 0 ? true : delete reqQuery.in;
            if (key === 'createdAt' || key === 'updatedAt') {
                for (const i in reqQuery) {
                    reqQuery[i] = (0, moment_1.default)(reqQuery[i]).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
                }
            }
            if (iin) {
                try {
                    reqQuery.in = JSON.parse(iin);
                    if (!Array.isArray(reqQuery.in)) {
                        throw new application_error_1.default('kindly provide a proper array in the in parameter');
                    }
                }
                catch (error) {
                    throw new application_error_1.default("kindly provide a proper array in the 'in' parameter");
                }
            }
            queryStr = JSON.stringify(reqQuery);
            queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);
            if (!lodash_1.default.isEmpty(JSON.parse(queryStr))) {
                query = {
                    [key]: queryStr ? JSON.parse(queryStr) : 1,
                };
            }
        }
        else {
            if (reqQuery === null || reqQuery === void 0 ? void 0 : reqQuery.page)
                reqQuery === null || reqQuery === void 0 ? true : delete reqQuery.page;
            query = reqQuery;
        }
        const t1 = perf_hooks_1.performance.now();
        console.log(" took  ", t1 - t0);
        if (model === 'ProductVariant') {
            query = model.find(query).select('-specifications');
        }
        else {
            query = model.find(query).select('-specifications');
        }
        if (populate === null || populate === void 0 ? void 0 : populate.length) {
            let populateQuery = [];
            for (const item of populate) {
                let newObject = { path: item, select: getPopulatedOptions(item) };
                populateQuery.push(newObject);
            }
            await query.populate(populateQuery);
        }
        if (req.query.sort) {
            if (req.query.sort === 'ASC' || req.query.sort === 'asc') {
                query = query.sort({ createdAt: -1 });
            }
            if (req.query.sort === 'DESC' || req.query.sort === 'desc') {
                query = query.sort({ createdAt: 1 });
            }
        }
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 20;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await model.countDocuments();
        if (req.query.page) {
            query = query.skip(startIndex);
        }
        if (req.query.limit) {
            query = query.limit(limit);
        }
        const results = await query;
        const pagination = {};
        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit,
            };
        }
        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit,
            };
        }
        let advancedResults = {
            count: results === null || results === void 0 ? void 0 : results.length,
            pagination,
            data: results,
        };
        const t2 = perf_hooks_1.performance.now();
        console.log(" took  ", t2 - t0);
        return advancedResults;
    }
    catch (error) {
        console.log("Eroror ====>", error);
        throw new application_error_1.default(error.message);
    }
};
exports.advancedResults = advancedResults;
const getPopulatedOptions = (population) => {
    switch (population) {
        case population = 'category':
            return 'name';
        case population = 'vendor':
            return 'businessName';
        case population = 'user':
            return 'fullName';
        case population = 'attachments':
            return 'url';
        case population = 'productBrand':
            return 'name';
    }
};

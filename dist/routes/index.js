"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const router = express_1.default.Router();
router.get('/api/ping', function (_req, res, _next) {
    res.sendStatus(200);
});
router.get('/', function (_req, res, _next) {
    res.sendStatus(200);
});
router.get('/api/v1/access', function (_req, res, _next) {
    res.sendStatus(200);
});
module.exports = router;

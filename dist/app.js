"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const body_parser_1 = tslib_1.__importDefault(require("body-parser"));
const compression_1 = tslib_1.__importDefault(require("compression"));
const swagger_ui_express_1 = tslib_1.__importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = tslib_1.__importDefault(require("swagger-jsdoc"));
const express_1 = tslib_1.__importDefault(require("express"));
const cors_1 = tslib_1.__importDefault(require("cors"));
const helmet_1 = tslib_1.__importDefault(require("helmet"));
const config_1 = tslib_1.__importDefault(require("./routes/config"));
const logger_1 = tslib_1.__importDefault(require("./logger"));
const tracker_middleware_1 = require("./middlewares/tracker-middleware");
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    credentials: true,
    preflightContinue: true,
    exposedHeaders: [
        'Access-Control-Allow-Headers',
        'Access-Control-Allow-Origin, Origin, X-Requested-With, Content-Type, Accept',
        'X-Password-Expired',
    ],
    optionsSuccessStatus: 200,
}));
function logResponseTime(req, res, next) {
    const startHrTime = process.hrtime();
    res.on('finish', () => {
        const tracker = (0, tracker_middleware_1.trackerMiddleware)({});
        const { trackID, env, originatingFunction } = tracker;
        const elapsedHrTime = process.hrtime(startHrTime);
        const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
        const message = `tracker_ID:${trackID} env:${env} originatingFunction:${originatingFunction} ${req.method} ${res.statusCode} ${elapsedTimeInMs}ms\t${req.path}`;
        logger_1.default.log({
            level: 'debug',
            message,
            consoleLoggerOptions: { label: 'API' },
        });
    });
    next();
}
let envVariable = process.env.DOMAIN_URL || '';
let domainUrl = envVariable.split('//');
const options = {
    swagger: '2.0',
    definition: {
        info: {
            version: 'v1.0.0',
            title: "Megathron API's",
            description: 'This lists and describes megathron api endpoints',
        },
        host: `${domainUrl[1]}`,
        basePath: '/api/v1',
        schemes: ['http', 'https'],
    },
    apis: ['./src/*/*.ts'],
};
const swaggerDocs = (0, swagger_jsdoc_1.default)(options);
app.use(logResponseTime);
app.use((0, compression_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use('/api/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
config_1.default.forEach((rou) => {
    let route = rou[0];
    let router = rou[1];
    app.use(route, router);
});
process.on('uncaughtException', function (err) {
    console.log(`uncaughtException Error ${err}`);
});
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    return res.status(err.status || 500).json({
        error: err.message,
        req: req
    });
});
exports.default = app;

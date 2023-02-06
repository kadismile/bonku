"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("module-alias/register");
require("source-map-support/register");
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
const result = dotenv_1.default.config();
if (result.error) {
    dotenv_1.default.config({ path: '.env.default' });
}
const util_1 = tslib_1.__importDefault(require("util"));
const app_1 = tslib_1.__importDefault(require("./app"));
const safe_mongoose_connection_1 = tslib_1.__importDefault(require("./lib/safe-mongoose-connection"));
const logger_1 = tslib_1.__importDefault(require("./logger"));
const PORT = process.env.PORT || 80;
let debugCallback = null;
if (process.env.NODE_ENV === 'development') {
    debugCallback = (collectionName, method, query, doc) => {
        const message = `${doc}.${collectionName}.${method}(${util_1.default.inspect(query, { colors: true, depth: null })})`;
        logger_1.default.log({
            level: 'verbose',
            message,
            consoleLoggerOptions: { label: 'MONGO' },
        });
    };
}
const safeMongooseConnection = new safe_mongoose_connection_1.default({
    mongoUrl: process.env.MONGO_URL || '',
    debugCallback,
    onStartConnection: (mongoUrl) => logger_1.default.info(`Connecting to MongoDB at ${process.env.NODE_ENV}, ${mongoUrl} environment`),
    onConnectionError: (error, mongoUrl) => logger_1.default.log({
        level: 'error',
        message: `Could not connect to MongoDB with the provided credentials ${mongoUrl}`,
        error,
    }),
    onConnectionRetry: (mongoUrl) => logger_1.default.info(`Retrying to MongoDB at ${process.env.NODE_ENV} ${mongoUrl} environment`),
});
const serve = () => app_1.default.listen(PORT, () => {
    logger_1.default.info(`🌏 Express server started at http://localhost:${PORT}`);
});
if (process.env.MONGO_URL == null) {
    logger_1.default.error('MONGO_URL not specified in environment');
    process.exit(1);
}
else {
    safeMongooseConnection.connect((mongoUrl) => {
        logger_1.default.info(`Connected to MongoDB at ${process.env.NODE_ENV} environment ${mongoUrl}`);
        serve();
    });
}
process.on('SIGINT', () => {
    console.log('\n');
    logger_1.default.info('Gracefully shutting down');
    logger_1.default.info('Closing the MongoDB connection');
    safeMongooseConnection.close((err) => {
        if (err) {
            logger_1.default.log({
                level: 'error',
                message: 'Error shutting closing mongo connection',
                error: err,
            });
        }
        else {
            logger_1.default.info('Mongo connection closed successfully');
        }
        process.exit(0);
    }, true);
});

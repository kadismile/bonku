"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const defaultMongooseConnectionOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
};
class SafeMongooseConnection {
    constructor(options) {
        this.isConnectedBefore = false;
        this.shouldCloseConnection = false;
        this.retryDelayMs = 2000;
        this.mongoConnectionOptions = defaultMongooseConnectionOptions;
        this.startConnection = () => {
            if (this.options.onStartConnection) {
                this.options.onStartConnection(this.options.mongoUrl);
            }
            mongoose_1.default.connect(this.options.mongoUrl, this.mongoConnectionOptions).catch(() => { });
        };
        this.onConnected = () => {
            this.isConnectedBefore = true;
            this.onConnectedCallback(this.options.mongoUrl);
        };
        this.onReconnected = () => {
            this.onConnectedCallback(this.options.mongoUrl);
        };
        this.onError = () => {
            if (this.options.onConnectionError) {
                const error = new Error(`Could not connect to MongoDB at ${process.env.NODE_ENV} environment`);
                this.options.onConnectionError(error, this.options.mongoUrl);
            }
        };
        this.onDisconnected = () => {
            if (!this.isConnectedBefore && !this.shouldCloseConnection) {
                this.connectionTimeout = setTimeout(() => {
                    this.startConnection();
                    clearTimeout(this.connectionTimeout);
                }, this.retryDelayMs);
                if (this.options.onConnectionRetry) {
                    this.options.onConnectionRetry(this.options.mongoUrl);
                }
            }
        };
        this.options = options;
        mongoose_1.default.connection.on('error', this.onError);
        mongoose_1.default.connection.on('connected', this.onConnected);
        mongoose_1.default.connection.on('disconnected', this.onDisconnected);
        mongoose_1.default.connection.on('reconnected', this.onReconnected);
        if (options.debugCallback) {
            mongoose_1.default.set('debug', options.debugCallback);
        }
        if (options.retryDelayMs) {
            this.retryDelayMs = options.retryDelayMs;
        }
    }
    close(onClosed = () => { }, force = false) {
        if (this.connectionTimeout) {
            clearTimeout(this.connectionTimeout);
        }
        this.shouldCloseConnection = true;
        mongoose_1.default.connection.close(force, onClosed);
    }
    connect(onConnectedCallback) {
        this.onConnectedCallback = onConnectedCallback;
        this.startConnection();
    }
}
exports.default = SafeMongooseConnection;

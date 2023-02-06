"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApplicationError extends Error {
    constructor(message, status) {
        super();
        this.message = 'ApplicationError';
        this.status = 500;
        if (message != null) {
            this.message = message;
        }
        if (status != null) {
            this.status = status;
        }
    }
}
exports.default = ApplicationError;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRole = void 0;
const errorHandler_1 = require("./errorHandler");
const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new errorHandler_1.AppError('Authentication required', 401));
        }
        if (!roles.includes(req.user.role)) {
            return next(new errorHandler_1.AppError('Not authorized to access this resource', 403));
        }
        next();
    };
};
exports.checkRole = checkRole;

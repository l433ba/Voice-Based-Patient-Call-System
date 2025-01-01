"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRole = exports.auth = exports.authorize = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Patient_1 = require("../models/Patient");
const Nurse_1 = require("../models/Nurse");
const AppError_1 = require("../utils/AppError");
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        if (!token) {
            throw new AppError_1.AppError('Authentication required', 401);
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        let user;
        if (decoded.role === 'patient') {
            user = yield Patient_1.Patient.findById(decoded.id);
        }
        else if (decoded.role === 'nurse') {
            user = yield Nurse_1.Nurse.findById(decoded.id);
        }
        else if (decoded.role === 'admin') {
            user = {
                _id: 'admin',
                role: 'admin',
                fullName: 'Administrator'
            };
        }
        if (!user) {
            throw new AppError_1.AppError('User not found', 404);
        }
        req.user = user;
        next();
    }
    catch (error) {
        next(new AppError_1.AppError('Please authenticate', 401));
    }
});
exports.protect = protect;
const authorize = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new AppError_1.AppError('Authentication required', 401));
        }
        if (!roles.includes(req.user.role)) {
            return next(new AppError_1.AppError('Not authorized to access this resource', 403));
        }
        next();
    };
};
exports.authorize = authorize;
const auth = (req, res, next) => {
    // Authentication logic
};
exports.auth = auth;
const checkRole = (roles) => {
    return (req, res, next) => {
        // Role checking logic
    };
};
exports.checkRole = checkRole;

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
exports.updateProfile = exports.getProfile = exports.resetPassword = exports.forgotPassword = exports.login = exports.register = void 0;
const User_1 = require("../models/User");
const AppError_1 = require("../utils/AppError");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.User.create(req.body);
        const token = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_SECRET);
        res.status(201).json({
            success: true,
            data: { token, user },
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Registration failed',
        });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield User_1.User.findOne({ email });
        if (!user || !(yield user.comparePassword(password))) {
            throw new AppError_1.AppError('Invalid credentials', 401);
        }
        const token = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_SECRET);
        res.json({
            success: true,
            data: { token, user },
        });
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: 'Login failed',
        });
    }
});
exports.login = login;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield User_1.User.findOne({ email });
        if (!user) {
            throw new AppError_1.AppError('User not found', 404);
        }
        // Implement password reset logic here
        res.json({
            success: true,
            message: 'Password reset instructions sent',
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Password reset failed',
        });
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token, password } = req.body;
        // Implement password reset verification and update logic here
        res.json({
            success: true,
            message: 'Password reset successful',
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Password reset failed',
        });
    }
});
exports.resetPassword = resetPassword;
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            throw new AppError_1.AppError('User not found', 404);
        }
        res.json({
            success: true,
            data: req.user,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to get profile',
        });
    }
});
exports.getProfile = getProfile;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            throw new AppError_1.AppError('User not found', 404);
        }
        const updatedUser = yield User_1.User.findByIdAndUpdate(req.user._id, { $set: req.body }, { new: true });
        res.json({
            success: true,
            data: updatedUser,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to update profile',
        });
    }
});
exports.updateProfile = updateProfile;

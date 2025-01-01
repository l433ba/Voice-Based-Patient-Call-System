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
exports.updateProfile = exports.getProfile = exports.resetPassword = exports.forgotPassword = exports.login = exports.registerNurse = exports.registerPatient = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Patient_1 = require("../models/Patient");
const Nurse_1 = require("../models/Nurse");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const AppError_1 = require("../utils/AppError");
const User_1 = require("../models/User");
const registerPatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, email, password, fullAddress, contactNumber, emergencyContact, roomNumber, bedNumber, disease } = req.body;
        // Check if email exists
        const existingPatient = yield Patient_1.Patient.findOne({ email });
        if (existingPatient) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }
        // Hash password
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        // Create patient
        const patient = yield Patient_1.Patient.create({
            fullName,
            email,
            password: hashedPassword,
            fullAddress,
            contactNumber,
            emergencyContact,
            roomNumber,
            bedNumber,
            disease,
            role: 'patient'
        });
        // Generate token
        const token = jsonwebtoken_1.default.sign({ id: patient._id, role: 'patient' }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        // Send response with token and user data
        res.status(201).json({
            success: true,
            data: {
                token,
                user: {
                    id: patient._id,
                    fullName: patient.fullName,
                    email: patient.email,
                    role: 'patient'
                }
            }
        });
    }
    catch (error) {
        console.error('Patient registration error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Registration failed'
        });
    }
});
exports.registerPatient = registerPatient;
const registerNurse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, email, password, contactNumber, nurseRole } = req.body;
        // Validate required fields
        if (!fullName || !email || !password || !contactNumber || !nurseRole) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }
        // Check if email exists
        const existingNurse = yield Nurse_1.Nurse.findOne({ email });
        if (existingNurse) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }
        // Hash password
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        // Create nurse
        const nurse = yield Nurse_1.Nurse.create({
            fullName,
            email,
            password: hashedPassword,
            contactNumber,
            nurseRole,
            status: 'pending',
            role: 'nurse'
        });
        res.status(201).json({
            success: true,
            message: 'Registration successful. Please wait for admin approval.',
            data: {
                id: nurse._id,
                fullName: nurse.fullName,
                email: nurse.email,
                role: 'nurse'
            }
        });
    }
    catch (error) {
        console.error('Nurse registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed'
        });
    }
});
exports.registerNurse = registerNurse;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Admin login
        if (email === 'admin' && password === 'admin') {
            const token = jsonwebtoken_1.default.sign({ id: 'admin', role: 'admin' }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
            return res.json({
                success: true,
                data: {
                    token,
                    user: {
                        id: 'admin',
                        email: 'admin',
                        fullName: 'Administrator',
                        role: 'admin'
                    }
                }
            });
        }
        // First check if it's a nurse trying to login
        let user = yield Nurse_1.Nurse.findOne({ email });
        let role = 'nurse';
        // If not a nurse, check if it's a patient
        if (!user) {
            user = yield Patient_1.Patient.findOne({ email });
            role = 'patient';
        }
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        // Verify password
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        // For nurse, check approval status
        if (role === 'nurse') {
            const nurseUser = user;
            if (nurseUser.status !== 'approved') {
                return res.status(403).json({
                    success: false,
                    message: 'Your account is pending approval. Please wait for admin approval.'
                });
            }
        }
        // Generate token
        const token = jsonwebtoken_1.default.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        // Send response
        res.json({
            success: true,
            data: {
                token,
                user: Object.assign({ id: user._id, fullName: user.fullName, email: user.email, role }, (role === 'nurse' && { nurseRole: user.nurseRole }))
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed. Please try again.'
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

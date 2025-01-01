"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateGetUsersByRole = exports.validateApproval = exports.validateUserUpdate = exports.validateRequestStatus = exports.validateRequest = exports.validatePatientRegistration = exports.validateNurseApproval = exports.validateLogin = exports.validateRegistration = void 0;
const express_validator_1 = require("express-validator");
exports.validateRegistration = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Please enter a valid email'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    (0, express_validator_1.body)('fullName').trim().notEmpty().withMessage('Full name is required'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }
        next();
    }
];
exports.validateLogin = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Please enter a valid email'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }
        next();
    }
];
exports.validateNurseApproval = [
    (0, express_validator_1.body)('status')
        .isIn(['approved', 'rejected'])
        .withMessage('Invalid status'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }
        next();
    }
];
exports.validatePatientRegistration = [
    (0, express_validator_1.body)('fullName')
        .trim()
        .notEmpty()
        .withMessage('Full name is required'),
    (0, express_validator_1.body)('email')
        .trim()
        .isEmail()
        .withMessage('Valid email is required'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
    (0, express_validator_1.body)('fullAddress')
        .trim()
        .notEmpty()
        .withMessage('Address is required'),
    (0, express_validator_1.body)('contactNumber')
        .trim()
        .notEmpty()
        .withMessage('Contact number is required'),
    (0, express_validator_1.body)('emergencyContact')
        .trim()
        .notEmpty()
        .withMessage('Emergency contact is required'),
    (0, express_validator_1.body)('roomNumber')
        .trim()
        .notEmpty()
        .withMessage('Room number is required'),
    (0, express_validator_1.body)('bedNumber')
        .trim()
        .notEmpty()
        .withMessage('Bed number is required'),
    (0, express_validator_1.body)('disease')
        .trim()
        .notEmpty()
        .withMessage('Disease is required'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: errors.array()[0].msg,
                errors: errors.array()
            });
        }
        next();
    }
];
exports.validateRequest = [
    (0, express_validator_1.body)('fullName')
        .trim()
        .notEmpty()
        .withMessage('Full name is required'),
    (0, express_validator_1.body)('contactNumber')
        .trim()
        .notEmpty()
        .withMessage('Contact number is required'),
    (0, express_validator_1.body)('roomNumber')
        .trim()
        .notEmpty()
        .withMessage('Room number is required'),
    (0, express_validator_1.body)('disease')
        .trim()
        .notEmpty()
        .withMessage('Disease is required'),
    (0, express_validator_1.body)('bedNumber')
        .optional()
        .trim(),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }
        next();
    }
];
exports.validateRequestStatus = [
    (0, express_validator_1.body)('status')
        .isIn(['pending', 'assigned', 'in_progress', 'completed', 'cancelled'])
        .withMessage('Invalid status'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }
        next();
    }
];
exports.validateUserUpdate = [
// ... existing validation rules
];
exports.validateApproval = exports.validateNurseApproval;
exports.validateGetUsersByRole = [
// ... validation rules for getting users by role
];

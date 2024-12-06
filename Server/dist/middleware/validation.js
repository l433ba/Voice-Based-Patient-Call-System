"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateGetUsersByRole = exports.validateRequestStatus = exports.validatePatientRegistration = exports.validateApproval = exports.validateUserUpdate = exports.validateRequest = exports.validateLogin = exports.validateRegistration = void 0;
const express_validator_1 = require("express-validator");
const types_1 = require("../types");
exports.validateRegistration = [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail(),
    (0, express_validator_1.body)('password').isLength({ min: 6 }),
    (0, express_validator_1.body)('firstName').trim().notEmpty(),
    (0, express_validator_1.body)('lastName').trim().notEmpty(),
    (0, express_validator_1.body)('role').isIn(Object.values(types_1.UserRole)),
    (0, express_validator_1.body)('department').optional().trim().notEmpty(),
    (0, express_validator_1.body)('room').optional().trim().notEmpty(),
    validateResult
];
exports.validateLogin = [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail(),
    (0, express_validator_1.body)('password').notEmpty(),
    validateResult
];
exports.validateRequest = [
    (0, express_validator_1.body)('description').trim().notEmpty(),
    (0, express_validator_1.body)('priority').isIn(Object.values(types_1.RequestPriority)),
    (0, express_validator_1.body)('department').isIn(Object.values(types_1.NursingDepartment)),
    (0, express_validator_1.body)('patient').isMongoId().withMessage('Invalid patient ID'),
    (0, express_validator_1.body)('nurse').isMongoId().withMessage('Invalid nurse ID'),
    validateResult
];
exports.validateUserUpdate = [
    (0, express_validator_1.body)('firstName').optional().trim().notEmpty(),
    (0, express_validator_1.body)('lastName').optional().trim().notEmpty(),
    (0, express_validator_1.body)('department').optional().isMongoId(),
    (0, express_validator_1.body)('room').optional().trim().notEmpty(),
    (0, express_validator_1.body)('active').optional().isBoolean(),
    validateResult
];
exports.validateApproval = [
    (0, express_validator_1.body)('status').isIn([types_1.UserStatus.APPROVED, types_1.UserStatus.REJECTED]),
    validateResult
];
exports.validatePatientRegistration = [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail(),
    (0, express_validator_1.body)('password').isLength({ min: 6 }),
    (0, express_validator_1.body)('firstName').trim().notEmpty(),
    (0, express_validator_1.body)('lastName').trim().notEmpty(),
    (0, express_validator_1.body)('room').trim().notEmpty(),
    validateResult
];
exports.validateRequestStatus = [
    (0, express_validator_1.body)('status')
        .isIn(Object.values(types_1.RequestStatus))
        .withMessage('Invalid request status'),
    validateResult
];
exports.validateGetUsersByRole = [
    (0, express_validator_1.query)('role')
        .isIn(Object.values(types_1.UserRole))
        .withMessage('Invalid user role'),
    (0, express_validator_1.query)('status')
        .optional()
        .isIn(Object.values(types_1.UserStatus))
        .withMessage('Invalid user status'),
    validateResult
];
function validateResult(req, res, next) {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

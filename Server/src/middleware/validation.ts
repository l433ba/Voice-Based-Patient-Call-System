import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validateRegistration = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('fullName').trim().notEmpty().withMessage('Full name is required'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

export const validateLogin = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

export const validateNurseApproval = [
  body('status')
    .isIn(['approved', 'rejected'])
    .withMessage('Invalid status'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

export const validatePatientRegistration = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('fullAddress')
    .trim()
    .notEmpty()
    .withMessage('Address is required'),
  body('contactNumber')
    .trim()
    .notEmpty()
    .withMessage('Contact number is required'),
  body('emergencyContact')
    .trim()
    .notEmpty()
    .withMessage('Emergency contact is required'),
  body('roomNumber')
    .trim()
    .notEmpty()
    .withMessage('Room number is required'),
  body('bedNumber')
    .trim()
    .notEmpty()
    .withMessage('Bed number is required'),
  body('disease')
    .trim()
    .notEmpty()
    .withMessage('Disease is required'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
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

export const validateRequest = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required'),
  body('contactNumber')
    .trim()
    .notEmpty()
    .withMessage('Contact number is required'),
  body('roomNumber')
    .trim()
    .notEmpty()
    .withMessage('Room number is required'),
  body('disease')
    .trim()
    .notEmpty()
    .withMessage('Disease is required'),
  body('bedNumber')
    .optional()
    .trim(),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

export const validateRequestStatus = [
  body('status')
    .isIn(['pending', 'assigned', 'in_progress', 'completed', 'cancelled'])
    .withMessage('Invalid status'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

export const validateUserUpdate = [
  // ... existing validation rules
];

export const validateApproval = validateNurseApproval;

export const validateGetUsersByRole = [
  // ... validation rules for getting users by role
];
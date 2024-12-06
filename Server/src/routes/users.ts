import express from 'express';
import { protect, authorize } from '../middleware/auth';
import { UserRole } from '../types';
import {
  getUsers,
  updateUser,
  getPendingNurses,
  approveNurse,
  getUsersByRole,
  registerPatient,
} from '../controllers/userController';
import { validateUserUpdate, validatePatientRegistration, validateApproval } from '../middleware/validation';
import { validateGetUsersByRole } from '../middleware/validation';

const router = express.Router();

router.use(protect);

// Admin routes
router.get('/', authorize([UserRole.ADMIN]), getUsers);
router.get('/by-role', authorize([UserRole.ADMIN]), validateGetUsersByRole, getUsersByRole);
router.get('/pending-nurses', authorize([UserRole.ADMIN]), getPendingNurses);
router.patch('/:id', authorize([UserRole.ADMIN]), validateUserUpdate, updateUser);
router.patch('/:id/approve', authorize([UserRole.ADMIN]), validateApproval, approveNurse);  

// Nurse routes
router.post(
  '/register-patient',
  authorize([UserRole.NURSE]),
  validatePatientRegistration,
  registerPatient
);

export default router;
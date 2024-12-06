import express from 'express';
import { protect, authorize } from '../middleware/auth';
import {
  registerPatient,
  getPatients,
  getPatientById
} from '../controllers/patientController';
import { validatePatientRegistration } from '../middleware/validation';

const router = express.Router();

// Protected routes
router.use(protect);

// Nurse routes
router.post(
  '/register',
  authorize(['nurse']),
  validatePatientRegistration,
  registerPatient
);

// Shared routes (nurse and admin)
router.get(
  '/',
  authorize(['nurse', 'admin']),
  getPatients
);

router.get(
  '/:id',
  authorize(['nurse', 'admin']),
  getPatientById
);

export default router; 
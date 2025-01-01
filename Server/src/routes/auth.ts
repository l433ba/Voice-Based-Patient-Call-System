import express from 'express';
import { registerPatient, registerNurse, login } from '../controllers/authController';
import { validatePatientRegistration } from '../middleware/validation';

const router = express.Router();

router.post('/register-patient', validatePatientRegistration, registerPatient);
router.post('/register-nurse', registerNurse);
router.post('/login', login);

export default router;
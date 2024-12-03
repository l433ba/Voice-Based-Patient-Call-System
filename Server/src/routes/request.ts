import express from 'express';
import { protect, authorize } from '../middleware/auth';
import {
  createRequest,
  getRequests,
  updateRequestStatus,
  assignRequest
} from '../controllers/requestController';
import { validateRequest, validateRequestStatus } from '../middleware/validation';

const router = express.Router();

// Protected routes - all routes require authentication
router.use(protect);

// Patient routes
router.post('/', authorize(['patient']), validateRequest, createRequest);

// Shared routes
router.get('/', getRequests);

// Nurse and admin routes
router.put(
  '/:requestId/status',
  authorize(['nurse', 'admin']),
  validateRequestStatus,
  updateRequestStatus
);

router.put(
  '/:requestId/assign',
  authorize(['admin']),
  assignRequest
);

export default router; 
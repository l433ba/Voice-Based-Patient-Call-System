import express from 'express';
import { protect, authorize } from '../middleware/auth';
import { UserRole } from '../types';
import {
  createRequest,
  getRequests,
  assignRequest,
  updateRequestStatus,
} from '../controllers/requestController';

const router = express.Router();

router.use(protect);

// Patient routes
router.post('/', authorize(['patient']), createRequest);

// Shared routes
router.get('/', getRequests);

// Admin and nurse routes
router.put(
  '/:id/assign',
  authorize(['admin', 'nurse']),
  assignRequest
);

router.put(
  '/:id/status',
  authorize(['admin', 'nurse']),
  updateRequestStatus
);

export default router;
import express from 'express';
import { protect } from '../middleware/auth';
import {
  createRequest,
  getRequests,
  updateRequestStatus,
  assignRequest
} from '../controllers/requestController';

const router = express.Router();

// Protected routes - all routes require authentication
router.use(protect);

// Patient routes - temporarily remove validation
router.post('/', createRequest);

// Shared routes
router.get('/', getRequests);

// Nurse and admin routes
router.put(
  '/:requestId/status',
  updateRequestStatus
);

router.put(
  '/:requestId/assign',
  assignRequest
);

router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default router; 
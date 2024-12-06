import express from 'express';
import { protect, authorize } from '../middleware/auth';
import {
  getNurses,
  approveNurse,
  rejectNurse
} from '../controllers/nurseController';

const router = express.Router();

// Protected routes
router.use(protect);

// Admin routes
router.get('/', authorize(['admin']), getNurses);
router.put('/:id/approve', authorize(['admin']), approveNurse);
router.put('/:id/reject', authorize(['admin']), rejectNurse);

export default router; 
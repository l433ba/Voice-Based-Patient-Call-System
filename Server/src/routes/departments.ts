import { Router } from 'express';
import { getAllDepartments } from '../controllers/departmentController';

const router = Router();


// Get all departments
router.get('/', getAllDepartments);

export default router;

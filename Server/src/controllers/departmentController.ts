import { Request, Response } from 'express';
import { NursingDepartment } from '../types';

export const getAllDepartments = async (req: Request, res: Response) => {
  try {
    const departments = Object.values(NursingDepartment).map(name => ({
      id: name.toLowerCase().replace(/\s+/g, '_'),
      name,
    }));

    res.json({
      departments,
      count: departments.length,
    });
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ message: 'Error fetching departments' });
  }
};

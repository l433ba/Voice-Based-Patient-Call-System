import { Request, Response } from 'express';
import { Nurse } from '../models/Nurse';
import { AppError } from '../utils/AppError';

export const getNurses = async (req: Request, res: Response) => {
  try {
    const nurses = await Nurse.find()
      .select('-password')
      .lean();

    res.json({
      success: true,
      data: nurses
    });
  } catch (error) {
    console.error('Error fetching nurses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch nurses'
    });
  }
};

export const approveNurse = async (req: Request, res: Response) => {
  try {
    const nurse = await Nurse.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    ).select('-password');

    if (!nurse) {
      return res.status(404).json({
        success: false,
        message: 'Nurse not found'
      });
    }

    res.json({
      success: true,
      data: nurse
    });
  } catch (error) {
    console.error('Error approving nurse:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve nurse'
    });
  }
};

export const rejectNurse = async (req: Request, res: Response) => {
  try {
    const nurse = await Nurse.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    ).select('-password');

    if (!nurse) {
      return res.status(404).json({
        success: false,
        message: 'Nurse not found'
      });
    }

    res.json({
      success: true,
      data: nurse
    });
  } catch (error) {
    console.error('Error rejecting nurse:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject nurse'
    });
  }
};

export const getAssignedPatients = async (req: Request, res: Response) => {
  try {
    const nurse = await Nurse.findOne({ user: req.user?._id })
      .populate({
        path: 'assignedPatients',
        populate: {
          path: 'user',
          select: 'firstName lastName fullName email'
        }
      });

    if (!nurse) {
      return res.status(404).json({
        success: false,
        message: 'Nurse not found'
      });
    }

    res.json({
      success: true,
      data: nurse.assignedPatients
    });
  } catch (error) {
    console.error('Error fetching assigned patients:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assigned patients'
    });
  }
}; 
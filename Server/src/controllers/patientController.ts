import { Request, Response } from 'express';
import { User } from '../models/User';
import { Patient } from '../models/Patient';

export const registerPatient = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      medicalHistory,
      emergencyContact
    } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: 'patient',
      status: 'approved'
    });

    // Create patient profile
    const patient = await Patient.create({
      user: user._id,
      medicalHistory,
      emergencyContact
    });

    res.status(201).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role
        },
        patient
      }
    });
  } catch (error) {
    console.error('Error registering patient:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register patient'
    });
  }
};

export const getPatients = async (req: Request, res: Response) => {
  try {
    const patients = await User.find({ role: 'patient' })
      .select('-password')
      .populate({
        path: 'patient',
        select: 'medicalHistory emergencyContact'
      });

    res.json({
      success: true,
      data: patients
    });
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patients'
    });
  }
};

export const getPatientById = async (req: Request, res: Response) => {
  try {
    const patient = await User.findOne({ 
      _id: req.params.id,
      role: 'patient'
    })
      .select('-password')
      .populate({
        path: 'patient',
        select: 'medicalHistory emergencyContact'
      });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.json({
      success: true,
      data: patient
    });
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patient'
    });
  }
}; 
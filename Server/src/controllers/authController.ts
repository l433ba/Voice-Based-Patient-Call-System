import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Patient } from '../models/Patient';
import { Nurse } from '../models/Nurse';
import bcrypt from 'bcryptjs';
import { AppError } from '../utils/AppError';
import { User } from '../models/User';

export const registerPatient = async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      email,
      password,
      fullAddress,
      contactNumber,
      emergencyContact,
      roomNumber,
      bedNumber,
      disease
    } = req.body;

    // Check if email exists
    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create patient
    const patient = await Patient.create({
      fullName,
      email,
      password: hashedPassword,
      fullAddress,
      contactNumber,
      emergencyContact,
      roomNumber,
      bedNumber,
      disease,
      role: 'patient'
    });

    // Generate token
    const token = jwt.sign(
      { id: patient._id, role: 'patient' },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Send response with token and user data
    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: patient._id,
          fullName: patient.fullName,
          email: patient.email,
          role: 'patient'
        }
      }
    });
  } catch (error: any) {
    console.error('Patient registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Registration failed'
    });
  }
};

export const registerNurse = async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      email,
      password,
      contactNumber,
      nurseRole
    } = req.body;

    // Validate required fields
    if (!fullName || !email || !password || !contactNumber || !nurseRole) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check if email exists
    const existingNurse = await Nurse.findOne({ email });
    if (existingNurse) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create nurse
    const nurse = await Nurse.create({
      fullName,
      email,
      password: hashedPassword,
      contactNumber,
      nurseRole,
      status: 'pending',
      role: 'nurse'
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please wait for admin approval.',
      data: {
        id: nurse._id,
        fullName: nurse.fullName,
        email: nurse.email,
        role: 'nurse'
      }
    });
  } catch (error) {
    console.error('Nurse registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Admin login
    if (email === 'admin' && password === 'admin') {
      const token = jwt.sign(
        { id: 'admin', role: 'admin' },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      return res.json({
        success: true,
        data: {
          token,
          user: {
            id: 'admin',
            email: 'admin',
            fullName: 'Administrator',
            role: 'admin'
          }
        }
      });
    }

    // First check if it's a nurse trying to login
    let user = await Nurse.findOne({ email });
    let role = 'nurse';

    // If not a nurse, check if it's a patient
    if (!user) {
      user = await Patient.findOne({ email });
      role = 'patient';
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // For nurse, check approval status
    if (role === 'nurse') {
      const nurseUser = user as any;
      if (nurseUser.status !== 'approved') {
        return res.status(403).json({
          success: false,
          message: 'Your account is pending approval. Please wait for admin approval.'
        });
      }
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, role },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Send response
    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role,
          ...(role === 'nurse' && { nurseRole: (user as any).nurseRole })
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.'
    });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Implement password reset logic here
    res.json({
      success: true,
      message: 'Password reset instructions sent',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Password reset failed',
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;
    // Implement password reset verification and update logic here
    res.json({
      success: true,
      message: 'Password reset successful',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Password reset failed',
    });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new AppError('User not found', 404);
    }
    res.json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to get profile',
    });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new AppError('User not found', 404);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: req.body },
      { new: true }
    );

    res.json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update profile',
    });
  }
};
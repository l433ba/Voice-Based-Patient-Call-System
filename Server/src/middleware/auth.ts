import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Patient } from '../models/Patient';
import { Nurse } from '../models/Nurse';
import { AppError } from '../utils/AppError';
import { IUser } from '../models/User';

interface JwtPayload {
  id: string;
  role: string;
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new AppError('Authentication required', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    
    let user;
    if (decoded.role === 'patient') {
      user = await Patient.findById(decoded.id);
    } else if (decoded.role === 'nurse') {
      user = await Nurse.findById(decoded.id);
    } else if (decoded.role === 'admin') {
      user = {
        _id: 'admin',
        role: 'admin',
        fullName: 'Administrator'
      };
    }

    if (!user) {
      throw new AppError('User not found', 404);
    }

    req.user = user as IUser;
    next();
  } catch (error) {
    next(new AppError('Please authenticate', 401));
  }
};

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('Not authorized to access this resource', 403));
    }

    next();
  };
};

export const auth = (req: Request, res: Response, next: NextFunction) => {
  // Authentication logic
};

export const checkRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Role checking logic
  };
};
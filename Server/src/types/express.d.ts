import { Document } from 'mongoose';
import { IPatient } from '../models/Patient';
import { INurse } from '../models/Nurse';

declare global {
  namespace Express {
    interface Request {
      user?: Document & (IPatient | INurse | { _id: string; role: string; fullName: string });
    }
  }
} 
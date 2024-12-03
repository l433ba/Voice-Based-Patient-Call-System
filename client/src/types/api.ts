import { User, Patient, Nurse } from './common';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface PatientResponse extends Patient {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface NurseResponse extends Nurse {
  id: string;
  name: string;
  email: string;
  role: string;
  experience: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface RequestResponse {
  _id: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
}

export interface RequestFilters {
  status?: string;
  priority?: string;
  nurseId?: string;
  patientId?: string;
} 
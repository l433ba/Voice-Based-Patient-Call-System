export interface User {
  _id?: string;
  fullName: string;
  email: string;
  role: 'patient' | 'nurse' | 'admin';
  nurseRole?: string;
}

export interface Patient {
  _id: string;
  user: User;
  address: string;
  contactNumber: string;
  roomNumber: string;
  bedNumber: string;
  disease: string;
}

export interface Nurse {
  _id: string;
  user: User;
  nurseRole: string;
  experience: string;
  isApproved: boolean;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}
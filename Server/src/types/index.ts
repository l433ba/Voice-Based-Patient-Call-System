export enum UserRole {
  PATIENT = 'patient',
  NURSE = 'nurse',
  ADMIN = 'admin'
}

export enum RequestPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export enum RequestStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}
export enum UserStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export enum NursingDepartment {
  EMERGENCY = 'Emergency',
  INTENSIVE_CARE = 'Intensive Care',
  PEDIATRICS = 'Pediatrics',
  MATERNITY = 'Maternity',
  ONCOLOGY = 'Oncology',
  CARDIOLOGY = 'Cardiology',
  NEUROLOGY = 'Neurology',
  ORTHOPEDICS = 'Orthopedics',
  PSYCHIATRY = 'Psychiatry',
  REHABILITATION = 'Rehabilitation',
  GERIATRICS = 'Geriatrics',
  SURGERY = 'Surgery',
  OUTPATIENT = 'Outpatient',
}

export interface IUser {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department?: string;
  room?: string;
  active: boolean;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRequest {
  _id: string;
  patient: any;
  nurse?: string;
  priority: RequestPriority;
  status: RequestStatus;
  description: string;
  department: any;
  room: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDepartment {
  _id: string;
  name: string;
  floor: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
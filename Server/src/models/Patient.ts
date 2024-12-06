import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IPatient extends Document {
  fullName: string;
  email: string;
  password: string;
  fullAddress: string;
  contactNumber: string;
  emergencyContact: string;
  roomNumber: string;
  bedNumber: string;
  disease: string;
  role: 'patient';
}

const patientSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullAddress: { type: String, required: true },
  contactNumber: { type: String, required: true },
  emergencyContact: { type: String, required: true },
  roomNumber: { type: String, required: true },
  bedNumber: { type: String, required: true },
  disease: { type: String, required: true },
  role: { type: String, default: 'patient' }
}, {
  timestamps: true
});

// Add password comparison method
patientSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const Patient = mongoose.model<IPatient>('Patient', patientSchema); 
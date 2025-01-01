import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  password: string;
  role: 'patient' | 'nurse' | 'admin';
  department?: string;
  room?: string;
  status: 'pending' | 'approved' | 'rejected';
  active?: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  fullName: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['patient', 'nurse', 'admin'], required: true },
  department: { type: String },
  room: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (this.isModified('firstName') || this.isModified('lastName')) {
    this.fullName = `${this.firstName} ${this.lastName}`;
  }
  
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);
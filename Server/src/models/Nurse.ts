import mongoose, { Schema, Document } from 'mongoose';

export interface INurse extends Document {
  fullName: string;
  email: string;
  password: string;
  contactNumber: string;
  nurseRole: string;
  status: 'pending' | 'approved' | 'rejected';
  assignedPatients?: Schema.Types.ObjectId[];
  user?: Schema.Types.ObjectId;
}

const nurseSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contactNumber: { type: String, required: true },
  nurseRole: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

export const Nurse = mongoose.model<INurse>('Nurse', nurseSchema); 
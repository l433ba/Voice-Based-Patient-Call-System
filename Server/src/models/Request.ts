import mongoose, { Schema, Document } from 'mongoose';

export interface IRequest extends Document {
  patient: Schema.Types.ObjectId;
  fullName: string;
  contactNumber: string;
  roomNumber: string;
  bedNumber: string;
  disease: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  nurse?: Schema.Types.ObjectId;
  assignedAt?: Date;
  completedAt?: Date;
}

const requestSchema = new Schema({
  patient: {
    type: Schema.Types.ObjectId,
    ref: 'Patient',
    required: false
  },
  fullName: {
    type: String,
    required: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  roomNumber: {
    type: String,
    required: true
  },
  bedNumber: String,
  disease: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  nurse: {
    type: Schema.Types.ObjectId,
    ref: 'Nurse'
  },
  assignedAt: Date,
  completedAt: Date
}, {
  timestamps: true
});

// Indexes for better query performance
requestSchema.index({ status: 1, priority: 1 });
requestSchema.index({ patient: 1 });
requestSchema.index({ nurse: 1 });
requestSchema.index({ createdAt: -1 });

export const Request = mongoose.model<IRequest>('Request', requestSchema);
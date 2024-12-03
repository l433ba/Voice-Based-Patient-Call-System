import mongoose, { Schema, Document } from 'mongoose';

export interface IRequest extends Document {
  patient: Schema.Types.ObjectId;
  nurse?: Schema.Types.ObjectId;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  assignedAt?: Date;
  completedAt?: Date;
}

const requestSchema = new Schema({
  patient: {
    type: Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  nurse: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  description: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
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
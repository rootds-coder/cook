import mongoose, { Document, Schema } from 'mongoose';

export interface IHelpRequest extends Document {
  title: string;
  description: string;
  status: 'pending' | 'inProgress' | 'resolved';
  email?: string;
  name?: string;
  createdAt: Date;
  deletionDate?: Date;
  updatedAt: Date;
}

const HelpRequestSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'inProgress', 'resolved'],
    default: 'pending',
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v: string) {
        return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Please enter a valid email address',
    },
  },
  name: {
    type: String,
    trim: true,
  },
  deletionDate: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Index for auto-deletion
HelpRequestSchema.index({ deletionDate: 1 }, { 
  expireAfterSeconds: 0,
  partialFilterExpression: { deletionDate: { $exists: true } }
});

export default mongoose.model<IHelpRequest>('HelpRequest', HelpRequestSchema);

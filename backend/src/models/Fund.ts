import mongoose, { Document, Schema } from 'mongoose';

export interface IFund extends Document {
  name: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  status: 'active' | 'completed' | 'pending';
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const fundSchema = new Schema<IFund>(
  {
    name: {
      type: String,
      required: [true, 'Fund name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Fund description is required'],
    },
    targetAmount: {
      type: Number,
      required: [true, 'Target amount is required'],
      min: [0, 'Target amount cannot be negative'],
    },
    currentAmount: {
      type: Number,
      default: 0,
      min: [0, 'Current amount cannot be negative'],
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'pending'],
      default: 'pending',
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
      validate: {
        validator: function(this: IFund, endDate: Date) {
          return endDate > this.startDate;
        },
        message: 'End date must be after start date',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Add index for better query performance
fundSchema.index({ status: 1, startDate: 1, endDate: 1 });

export default mongoose.model<IFund>('Fund', fundSchema); 
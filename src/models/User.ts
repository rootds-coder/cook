import mongoose, { Document } from 'mongoose';

export interface IUser {
  email: string;
  password: string;
}

export interface IUserDocument extends IUser, Document {}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export const User = mongoose.model<IUserDocument>('User', userSchema); 
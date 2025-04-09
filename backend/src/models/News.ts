import mongoose, { Schema, Document } from 'mongoose';

export interface INews extends Document {
  title: string;
  content: string;
  summary: string;
  image: string;
  author: string;
  category: 'news' | 'story' | 'update';
  status: 'draft' | 'published';
  date: Date;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const newsSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['news', 'story', 'update'],
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  publishedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Add indexes for better query performance
newsSchema.index({ status: 1, date: -1 });
newsSchema.index({ category: 1 });
newsSchema.index({ author: 1 });

export default mongoose.model<INews>('News', newsSchema); 
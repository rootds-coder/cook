const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: 255
  },
  summary: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Education', 'Healthcare', 'Empowerment', 'Community', 'Events']
  },
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  author: {
    type: String,
    trim: true
  }
}, {
  timestamps: true // This will add createdAt and updatedAt fields
});

// Add indexes for better query performance
newsSchema.index({ status: 1, date: -1 }); // Compound index for status and date
newsSchema.index({ category: 1 }); // Index for category searches

const News = mongoose.model('News', newsSchema);

module.exports = News; 
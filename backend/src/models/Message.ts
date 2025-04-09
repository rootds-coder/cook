import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: false
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['contact', 'volunteer_request'],
    default: 'contact'
  },
  status: {
    type: String,
    enum: ['read', 'unread'],
    default: 'unread'
  },
  // Additional fields for volunteer requests
  skills: {
    type: String,
    required: false
  },
  availability: {
    type: String,
    enum: ['full-time', 'part-time', 'weekends'],
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Message = mongoose.model('Message', messageSchema);

export default Message; 
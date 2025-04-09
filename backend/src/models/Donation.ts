import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['upi', 'card', 'netbanking'],
    default: 'upi'
  },
  donor: {
    name: {
      type: String,
      required: false
    },
    email: {
      type: String,
      required: false
    },
    phone: {
      type: String,
      required: false
    }
  },
  purpose: {
    type: String,
    required: false
  },
  anonymous: {
    type: Boolean,
    default: true
  },
  message: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
donationSchema.index({ status: 1, createdAt: -1 });
donationSchema.index({ transactionId: 1 });

const Donation = mongoose.model('Donation', donationSchema);

export default Donation; 
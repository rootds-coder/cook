import express from 'express';
import { verifyJWT } from '../middleware/auth';

const router = express.Router();

// Get donation amount options
router.get('/amounts', (req, res) => {
  const amounts = [100, 500, 1000, 2000, 5000];
  res.json({ success: true, amounts });
});

// Verify payment
router.post('/verify', verifyJWT, (req, res) => {
  try {
    const { transactionId, amount } = req.body;
    
    // In a real application, you would verify the payment with a payment gateway
    // For now, we'll just simulate a successful payment
    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: { transactionId, amount }
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment'
    });
  }
});

export default router; 
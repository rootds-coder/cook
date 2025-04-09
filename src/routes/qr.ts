import express from 'express';
import QRCode from 'qrcode';
import config from '../config';
import ApiError from '../utils/ApiError';
import asyncHandler from '../utils/asyncHandler';

const router = express.Router();

// Generate QR code for payment
router.post('/generate', asyncHandler(async (req, res) => {
  const { amount } = req.body;

  // Validate amount
  if (!amount || isNaN(amount) || amount <= 0) {
    throw new ApiError(400, 'Invalid amount');
  }

  // Get UPI ID from config
  const upiId = config.upiId;
  if (!upiId) {
    throw new ApiError(500, 'UPI ID not configured');
  }

  // Format amount to 2 decimal places
  const formattedAmount = Number(amount).toFixed(2);

  // Construct UPI payment URL
  const upiUrl = `upi://pay?pa=${upiId}&pn=Donation&am=${formattedAmount}&cu=INR`;

  // Generate QR code
  const qrCode = await QRCode.toDataURL(upiUrl, {
    errorCorrectionLevel: 'H',
    margin: 1,
    width: 300,
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  });

  res.json({
    success: true,
    qrCode,
    amount: formattedAmount,
    upiUrl // For debugging
  });
}));

export default router; 
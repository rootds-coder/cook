import express from 'express';
import QRCode from 'qrcode';
import { config } from '../config';
import ApiError from '../utils/ApiError';
import asyncHandler from '../utils/asyncHandler';

const router = express.Router();

// Generate QR code for payment
router.post('/generate', asyncHandler(async (req, res) => {
  console.log('Received request to generate QR code:', req.body);
  const { amount } = req.body;

  if (!amount || isNaN(amount) || amount <= 0) {
    console.error('Invalid amount:', amount);
    throw new ApiError(400, 'Invalid amount. Please provide a valid positive number.');
  }

  // Get UPI ID from config
  const upiId = config.upiId;
  console.log('Using UPI ID:', upiId);
  
  if (!upiId || upiId === 'default-upi@bank') {
    console.error('UPI ID not configured properly');
    throw new ApiError(500, 'UPI ID not properly configured. Please set the UPI_ID environment variable.');
  }

  // Create UPI payment URL with proper formatting
  const formattedAmount = Number(amount).toFixed(2); // Ensure 2 decimal places
  const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent('Fund Source')}&am=${formattedAmount}&cu=INR&tn=${encodeURIComponent('Donation')}`;

  console.log('Generated UPI URL:', upiUrl);

  try {
    // Generate QR code with better options
    const qrCode = await QRCode.toDataURL(upiUrl, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 400,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });

    console.log('QR code generated successfully');

    res.json({
      success: true,
      qrCode,
      amount: Number(formattedAmount),
      upiUrl // Include the URL for debugging
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new ApiError(500, 'Failed to generate QR code');
  }
}));

export default router; 
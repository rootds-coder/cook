import { Request, Response } from 'express';
import QRCode from 'qrcode';
import { config } from '../config';
import ApiError from '../utils/ApiError';
import asyncHandler from '../utils/asyncHandler';

export const generatePaymentQR = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { amount } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
      throw new ApiError(400, 'Invalid amount. Please provide a valid positive number.');
    }

    // Get UPI ID from config
    const upiId = config.upiId;
    if (!upiId || upiId === 'default-upi@bank') {
      throw new ApiError(500, 'UPI ID not properly configured. Please set the UPI_ID environment variable.');
    }

    // Create UPI payment URL with proper formatting
    const formattedAmount = Number(amount).toFixed(2); // Ensure 2 decimal places
    const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent('Fund Source')}&am=${formattedAmount}&cu=INR&tn=${encodeURIComponent('Donation')}`;

    console.log('Generating QR code for URL:', upiUrl);

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

    res.json({
      success: true,
      qrCode,
      amount: Number(formattedAmount),
      upiUrl // Include the URL for debugging
    });
  } catch (error) {
    console.error('QR generation error:', error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'Failed to generate QR code. Please try again.');
  }
}); 
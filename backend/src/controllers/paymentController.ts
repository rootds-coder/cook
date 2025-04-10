import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/ApiError';
import asyncHandler from '../utils/asyncHandler';
import Payment, { IPayment } from '../models/Payment';
import QRCode from 'qrcode';
import User from '../models/User';
import { config } from '../config';
import { RequestWithUser, AuthenticatedUser } from '../middleware/auth';

// Predefined donation amounts
const DONATION_AMOUNTS = [
  { value: 100, label: '₹100' },
  { value: 500, label: '₹500' },
  { value: 1000, label: '₹1000' },
  { value: 2000, label: '₹2000' },
  { value: 5000, label: '₹5000' },
  { value: 10000, label: '₹10000' },
];

export const getDonationAmounts = asyncHandler(async (req: Request, res: Response) => {
  res.json({
    success: true,
    amounts: DONATION_AMOUNTS
  });
});

export const generateQR = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { amount } = req.body;

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      throw new ApiError(400, 'Invalid amount. Please provide a valid positive number.');
    }

    // Create UPI URL with organization's UPI ID
    const upiUrl = `upi://pay?pa=${process.env.UPI_ID}&pn=Root%20Coder%20Foundation&am=${amount}&cu=INR&tn=Donation`;
    
    try {
      // Generate QR code
      const qrCode = await QRCode.toDataURL(upiUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });

      res.json({
        success: true,
        qrCode: qrCode,
        amount: Number(amount),
        upiUrl: upiUrl
      });
    } catch (qrError) {
      console.error('QR generation error:', qrError);
      throw new ApiError(500, 'Failed to generate QR code. Please try again.');
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error('Payment error:', error);
    throw new ApiError(500, 'An error occurred while processing your request.');
  }
});

export const verifyPayment = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const { amount, transactionId } = req.body;

    if (!amount || amount <= 0) {
      throw new ApiError(400, 'Invalid amount');
    }

    if (!transactionId) {
      throw new ApiError(400, 'Transaction ID is required');
    }

    if (!req.user?.id) {
        return next(new ApiError('User not authenticated or ID missing', 401));
    }

    // Create payment record
    const payment = await Payment.create({
      amount,
      transactionId,
      status: 'completed',
      userId: req.user.id
    });

    res.json({
      success: true,
      message: 'Payment verified successfully',
      payment
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    next(error instanceof ApiError ? error : new ApiError(500, 'Failed to verify payment'));
  }
});

export const createPaymentIntent = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const { amount, currency = 'usd' } = req.body;

  if (!req.user?.id) {
    return next(new ApiError('User not authenticated', 401));
  }

  const userIdCorrect = req.user.id;

  // ... rest of function using userIdCorrect
  res.status(501).json({ message: 'Payment Intent creation not fully implemented' });
}); 
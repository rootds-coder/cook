import express from 'express';
import { getDonationAmounts, generateQR, verifyPayment } from '../controllers/paymentController';
import { verifyJWT } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/amounts', getDonationAmounts);
router.post('/qr/generate', generateQR);

// Protected routes
router.post('/verify', verifyJWT, verifyPayment);

export default router; 
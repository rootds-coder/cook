import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';
import News from '../models/News';
import Donation from '../models/Donation';
import { authenticateAdmin } from '../middleware/auth';

const router = express.Router();

// Admin Login
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    res.json({ token, role: admin.role });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Dashboard Stats
router.get('/stats', authenticateAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalDonations = await Donation.countDocuments();
    const successfulDonations = await Donation.countDocuments({ status: 'completed' });
    const totalAmount = await Donation.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const activeNews = await News.countDocuments({ status: 'published' });

    const monthlyDonations = await Donation.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: { 
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' }
          },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const donationDistribution = await Donation.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: '$purpose', total: { $sum: '$amount' } } }
    ]);

    res.json({
      totalDonations,
      successfulDonations,
      totalAmount: totalAmount[0]?.total || 0,
      activeNews,
      monthlyDonations,
      donationDistribution
    });
  } catch (error: any) {
    console.error('Stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// News Management
router.post('/news', authenticateAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, content, summary, image, category, status } = req.body;
    const news = new News({
      title,
      content,
      summary,
      image,
      category,
      status,
      author: req.user.id
    });
    await news.save();
    res.status(201).json(news);
  } catch (error: any) {
    console.error('Create news error:', error);
    if (error?.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/news', authenticateAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const news = await News.find()
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    res.json(news);
  } catch (error: any) {
    console.error('Get news error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/news/:id', authenticateAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, content, summary, image, category, status } = req.body;
    const news = await News.findByIdAndUpdate(
      req.params.id,
      { title, content, summary, image, category, status },
      { new: true, runValidators: true }
    );
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }
    res.json(news);
  } catch (error: any) {
    console.error('Update news error:', error);
    if (error?.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/news/:id', authenticateAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.json({ message: 'News deleted successfully' });
  } catch (error: any) {
    console.error('Delete news error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Donation Management
router.get('/donations', authenticateAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = status ? { status } : {};
    
    const donations = await Donation.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));
    
    const total = await Donation.countDocuments(query);
    
    res.json({
      donations,
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page)
    });
  } catch (error: any) {
    console.error('Get donations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/donations/:id', authenticateAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(donation);
  } catch (error: any) {
    console.error('Update donation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Export donation data
router.get('/donations/export', authenticateAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate, status } = req.query;
    const query: any = {};
    
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }
    
    if (status) {
      query.status = status;
    }
    
    const donations = await Donation.find(query)
      .sort({ createdAt: -1 })
      .select('-__v');
    
    res.json(donations);
  } catch (error: any) {
    console.error('Export donations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
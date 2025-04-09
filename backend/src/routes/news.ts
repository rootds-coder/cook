import express from 'express';
import { verifyJWT, authenticateAdmin } from '../middleware/auth';
import {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews
} from '../controllers/newsController';

const router = express.Router();

// Public routes
router.get('/', getAllNews); // Get all published news
router.get('/:id', getNewsById); // Get a specific news article

// Admin routes - protected by authentication and admin check
router.use(verifyJWT);
router.use(authenticateAdmin);
router.post('/', createNews); // Create a new news article
router.put('/:id', updateNews); // Update a news article
router.delete('/:id', deleteNews); // Delete a news article

export default router; 
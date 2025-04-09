const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const auth = require('../middleware/auth'); // Assuming you have auth middleware

// Public routes
router.get('/', newsController.getAllNews); // Get all news (with optional status filter)
router.get('/:id', newsController.getNewsById); // Get a single news article

// Protected routes (require authentication)
router.post('/', auth, newsController.createNews); // Create a news article
router.put('/:id', auth, newsController.updateNews); // Update a news article
router.delete('/:id', auth, newsController.deleteNews); // Delete a news article

module.exports = router; 
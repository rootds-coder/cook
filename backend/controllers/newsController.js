const News = require('../models/News');

// Get all news articles (with optional status filter)
exports.getAllNews = async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    
    const news = await News.find(query)
      .sort({ date: -1 }) // Sort by date descending (newest first)
      .select('-__v'); // Exclude version key
    
    res.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ message: 'Error fetching news articles' });
  }
};

// Get a single news article by ID
exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id).select('-__v');
    if (!news) {
      return res.status(404).json({ message: 'News article not found' });
    }
    res.json(news);
  } catch (error) {
    console.error('Error fetching news article:', error);
    res.status(500).json({ message: 'Error fetching news article' });
  }
};

// Create a new news article
exports.createNews = async (req, res) => {
  try {
    const news = new News(req.body);
    await news.save();
    res.status(201).json(news);
  } catch (error) {
    console.error('Error creating news article:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error creating news article' });
  }
};

// Update a news article
exports.updateNews = async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-__v');

    if (!news) {
      return res.status(404).json({ message: 'News article not found' });
    }
    res.json(news);
  } catch (error) {
    console.error('Error updating news article:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error updating news article' });
  }
};

// Delete a news article
exports.deleteNews = async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News article not found' });
    }
    res.json({ message: 'News article deleted successfully' });
  } catch (error) {
    console.error('Error deleting news article:', error);
    res.status(500).json({ message: 'Error deleting news article' });
  }
}; 
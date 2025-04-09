const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { apiLimiter, authLimiter } = require('./middleware/rateLimiter');
const config = require('./config');

// Import routes
const newsRoutes = require('./routes/newsRoutes');

const app = express();

// Connect to MongoDB
mongoose.connect(config.mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting
app.use('/api/', apiLimiter); // Apply to all API routes

// Routes
app.use('/api/news', newsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Handle undefined routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Only start the server if we're not in a test environment
if (config.env !== 'test') {
  app.listen(config.port, () => {
    console.log(`Server is running in ${config.env} mode on port ${config.port}`);
  });
}

module.exports = app; 
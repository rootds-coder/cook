import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { apiLimiter } from './middleware/rateLimiter';
import authRoutes from './routes/auth';
import paymentRoutes from './routes/payment';
import qrRoutes from './routes/qr';
import adminRoutes from './routes/admin';
import volunteerRoutes from './routes/admin/volunteers';
import volunteerRequestRoutes from './routes/volunteer-requests';
import messageRoutes from './routes/admin/messages';
import newsRoutes from './routes/news';
import helpRequestRoutes from './routes/helpRequests';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', config.corsOrigin].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// API Routes
app.use('/api/v1/help-requests', helpRequestRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/qr', qrRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/volunteers', volunteerRoutes);
app.use('/api/volunteer-requests', volunteerRequestRoutes);
app.use('/api/admin/messages', messageRoutes);
app.use('/api/news', newsRoutes);

// Apply rate limiting to other API routes
app.use('/api/', apiLimiter);

// Error handling middleware
try {
  const errorHandler = require('./middleware/errorHandler');
  app.use(errorHandler.default || errorHandler);
} catch (error) {
  app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });
}

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Create indexes safely
    if (conn.connection.db) {
      await conn.connection.db.collection('users').createIndex({ email: 1 }, { unique: true });
    }
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

// Start server only if this file is run directly
if (require.main === module) {
  const startServer = async () => {
    try {
      await connectDB();
      const PORT = process.env.PORT || config.port;
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    } catch (error) {
      console.error('Error starting server:', error);
      process.exit(1);
    }
  };
  
  startServer();
} else {
  // Always connect to the database when importing this file
  connectDB();
}

// Export the app for serverless functions
export default app; 
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth';
import paymentRoutes from './routes/payment';
import qrRoutes from './routes/qr';
import newsRoutes from './routes/news';
import helpRequestRoutes from './routes/helpRequests';
import errorHandler from './middleware/errorHandler';
import ApiError from './utils/ApiError';
import { Request, Response, NextFunction } from 'express';

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('dev'));
app.use(helmet());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/help-requests', helpRequestRoutes);

// 404 handler
app.use((req, res, next) => {
  next(new ApiError(404, 'Resource not found'));
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("ERROR 💥", err);

  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Something went wrong';
    error = new ApiError(statusCode, message, error.errors || [], err.stack);
  }

  const response = {
    success: false,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    ...(error.errors && error.errors.length > 0 && { errors: error.errors }),
  };

  return res.status(error.statusCode).json(response);
});

export default app;
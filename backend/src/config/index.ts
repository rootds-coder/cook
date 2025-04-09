import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  mongoUri: string;
  jwtSecret: string;
  env: string;
  corsOrigin: string;
  rateLimiter: {
    windowMs: number;
    max: number;
  };
  authRateLimiter: {
    windowMs: number;
    max: number;
  };
}

export const config: Config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fund_source',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  rateLimiter: {
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 100 // limit each IP to 100 requests per window
  },
  authRateLimiter: {
    windowMs: 15 * 60 * 1000, // 15 minutes window
    max: 5 // limit each IP to 5 login attempts per window
  }
};
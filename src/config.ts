import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/fund-source',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  upiId: process.env.UPI_ID || 'your-upi-id@upi'
};

export default config; 
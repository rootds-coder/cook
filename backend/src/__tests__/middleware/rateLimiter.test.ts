import request from 'supertest';
import express, { Request, Response } from 'express';
import { apiLimiter, authLimiter, createAccountLimiter } from '../../middleware/rateLimiter';

describe('Rate Limiter Middleware', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
  });

  describe('API Limiter', () => {
    beforeEach(() => {
      app.use('/api', apiLimiter);
      app.get('/api/test', (req: Request, res: Response) => {
        res.status(200).json({ message: 'success' });
      });
    });

    it('should allow requests within the rate limit', async () => {
      const response = await request(app).get('/api/test');
      expect(response.status).toBe(200);
    });

    it('should block requests that exceed the rate limit', async () => {
      // Make more requests than the limit allows
      const requests = Array(101).fill(null);
      for (const _ of requests) {
        await request(app).get('/api/test');
      }
      const response = await request(app).get('/api/test');
      expect(response.status).toBe(429);
    });
  });

  describe('Auth Limiter', () => {
    beforeEach(() => {
      app.use('/auth', authLimiter);
      app.post('/auth/login', (req: Request, res: Response) => {
        res.status(200).json({ message: 'success' });
      });
    });

    it('should allow auth requests within the rate limit', async () => {
      const response = await request(app).post('/auth/login');
      expect(response.status).toBe(200);
    });

    it('should block auth requests that exceed the rate limit', async () => {
      // Make more requests than the limit allows
      const requests = Array(6).fill(null);
      for (const _ of requests) {
        await request(app).post('/auth/login');
      }
      const response = await request(app).post('/auth/login');
      expect(response.status).toBe(429);
    });
  });

  describe('Create Account Limiter', () => {
    beforeEach(() => {
      app.use('/register', createAccountLimiter);
      app.post('/register', (req: Request, res: Response) => {
        res.status(201).json({ message: 'account created' });
      });
    });

    it('should allow account creation within the rate limit', async () => {
      const response = await request(app).post('/register');
      expect(response.status).toBe(201);
    });

    it('should block account creation that exceeds the rate limit', async () => {
      // Make more requests than the limit allows
      const requests = Array(6).fill(null);
      for (const _ of requests) {
        await request(app).post('/register');
      }
      const response = await request(app).post('/register');
      expect(response.status).toBe(429);
    });
  });
}); 
const rateLimit = require('express-rate-limit');
const config = require('../config');

// Create different limiters for different routes
const createAccountLimiter = rateLimit({
  windowMs: config.rateLimiter.windowMs,
  max: 5, // limit each IP to 5 create account requests per window
  message: 'Too many accounts created from this IP, please try again after an hour',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const apiLimiter = rateLimit({
  windowMs: config.rateLimiter.windowMs,
  max: config.rateLimiter.max,
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// More strict limiter for auth routes
const authLimiter = rateLimit({
  windowMs: config.authRateLimiter.windowMs,
  max: config.authRateLimiter.max,
  message: 'Too many auth attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  createAccountLimiter,
  apiLimiter,
  authLimiter,
}; 
'use strict';
const rateLimit = require('express-rate-limit');
/**
 * Rate limiter for chat API endpoint
 * Limit: 20 requests per 15 minutes per IP
 */
const chatRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Terlalu banyak permintaan ke chatbot. Silakan tunggu beberapa menit sebelum mencoba lagi.',
  },
  handler: (req, res, next, options) => {
    res.status(429).json(options.message);
  },
});
/**
 * Rate limiter for admin login
 * Limit: 10 attempts per 15 minutes per IP
 */
const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Terlalu banyak percobaan login. Silakan tunggu 15 menit.',
  handler: (req, res, next, options) => {
    res.status(429).render('admin/login', {
      title: 'Admin Login',
      error: options.message,
      email: '',
    });
  },
});
module.exports = { chatRateLimiter, loginRateLimiter };

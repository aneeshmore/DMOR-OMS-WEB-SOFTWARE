import rateLimit from 'express-rate-limit';
import logger from '../config/logger.js';

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2000, // Limit each IP to 2000 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      path: req.path,
      method: req.method,
    });
    res.status(429).json({
      success: false,
      message: 'Too many requests from this IP, please try again later.',
    });
  },
});

// Strict rate limiter for write operations (POST, PUT, DELETE)
export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 write requests per windowMs
  message: {
    success: false,
    message: 'Too many write requests, please try again later.',
  },
  skip: req => req.method === 'GET', // Only apply to non-GET requests
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Strict rate limit exceeded', {
      ip: req.ip,
      path: req.path,
      method: req.method,
    });
    res.status(429).json({
      success: false,
      message: 'Too many write requests, please try again later.',
    });
  },
});

// Create endpoint limiter
export const createLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 500, // Limit each IP to 500 create requests per hour
  message: {
    success: false,
    message: 'Too many create requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Factory function to create custom rate limiters
 * @param {Object} options - Rate limit options
 * @returns {Function} Rate limit middleware
 */
export function createCustomLimiter(options) {
  return rateLimit({
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logger.warn('Rate limit exceeded', {
        ip: req.ip,
        path: req.path,
        method: req.method,
      });
      res.status(429).json({
        success: false,
        message: options.message || 'Too many requests, please try again later.',
      });
    },
    ...options,
  });
}

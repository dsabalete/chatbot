import rateLimit from 'express-rate-limit';
import { config } from '../config/index.js';

export const globalLimiter = rateLimit({
  windowMs: config.rateLimit.globalWindowMs,
  limit: config.rateLimit.globalMax,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

export const chatLimiter = rateLimit({
  windowMs: config.rateLimit.chatWindowMs,
  limit: config.rateLimit.chatMax,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many chat requests, please try again later.' },
});

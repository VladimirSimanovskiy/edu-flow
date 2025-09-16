import rateLimit from 'express-rate-limit';
import { createError } from './errorHandler';
import { config } from '../config';

// Rate limiter для логина
export const loginRateLimiter = rateLimit({
  windowMs: parseInt(config.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(config.RATE_LIMIT_MAX_ATTEMPTS || '5'),
  message: {
    error: {
      message: 'Слишком много попыток входа. Попробуйте позже.',
      code: 'RATE_LIMIT_EXCEEDED'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Пропускаем успешные запросы
  skipSuccessfulRequests: true,
  // Пропускаем неудачные запросы с определенными кодами ошибок
  skip: (req, res) => {
    // Пропускаем если это не POST запрос к /login
    return req.method !== 'POST' || !req.path.includes('/login');
  },
  // Кастомный обработчик ошибок
  handler: (req, res) => {
    const error = createError('Слишком много попыток входа. Попробуйте позже.', 429);
    res.status(429).json(error);
  }
});

// Rate limiter для регистрации
export const registerRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 час
  max: 3, // максимум 3 попытки регистрации в час
  message: {
    error: {
      message: 'Слишком много попыток регистрации. Попробуйте позже.',
      code: 'REGISTRATION_RATE_LIMIT_EXCEEDED'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    const error = createError('Слишком много попыток регистрации. Попробуйте позже.', 429);
    res.status(429).json(error);
  }
});

// Общий rate limiter для API
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // максимум 100 запросов на IP за 15 минут
  message: {
    error: {
      message: 'Слишком много запросов. Попробуйте позже.',
      code: 'API_RATE_LIMIT_EXCEEDED'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const error = createError('Слишком много запросов. Попробуйте позже.', 429);
    res.status(429).json(error);
  }
});

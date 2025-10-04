import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { createError } from './errorHandler';

/**
 * Middleware для валидации данных с использованием Zod
 */
export const validateBody = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
        next(createError(`Validation error: ${errorMessage}`, 400));
      } else {
        next(createError('Invalid request data', 400));
      }
    }
  };
};

export const validateQuery = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
        next(createError(`Query validation error: ${errorMessage}`, 400));
      } else {
        next(createError('Invalid query parameters', 400));
      }
    }
  };
};

export const validateParams = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.params = schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
        next(createError(`Parameter validation error: ${errorMessage}`, 400));
      } else {
        next(createError('Invalid route parameters', 400));
      }
    }
  };
};

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { createError } from './errorHandler';

export interface AuthUserPayload {
  id: number;
  email: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT';
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string;
}

export interface AuthRequest extends Request {
  user?: AuthUserPayload;
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(createError('Access token required', 401));
  }

  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) {
    return next(createError('Server configuration error', 500));
  }

  jwt.verify(token, secret, {
    algorithms: ['HS256'],
    issuer: process.env.JWT_ISSUER || undefined,
    audience: process.env.JWT_AUDIENCE || undefined,
  }, (err, user) => {
    if (err) {
      return next(createError('Invalid or expired token', 403));
    }
    req.user = user as AuthUserPayload;
    next();
  });
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createError('Authentication required', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(createError('Insufficient permissions', 403));
    }

    next();
  };
};

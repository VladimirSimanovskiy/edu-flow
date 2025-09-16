import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createError } from '../middleware/errorHandler';
import { AuthRequest, authenticateToken, requireRole } from '../middleware/auth';
import { loginRateLimiter, registerRateLimiter } from '../middleware/rateLimiter';
import { PrismaClient, UserRole } from '@prisma/client';
import { z } from 'zod';
import { LoginRequestSchema, RegisterRequestSchema } from '../schemas/auth';
import { prisma } from '../config/database';
import { AuthRepository } from '../repositories/auth.repository';
import { AuthService } from '../services/auth.service';

const router: Router = Router();
const authRepo = new AuthRepository(prisma);
const authService = new AuthService(authRepo);

// Validation schemas
export const loginSchema = LoginRequestSchema;

export const registerSchema = RegisterRequestSchema;

// Login
router.post('/login', loginRateLimiter, async (req, res, next) => {
  try {
    // Validate input
    const validationResult = loginSchema.safeParse(req.body);
    if (!validationResult.success) {
      return next(createError('Validation failed: ' + validationResult.error.errors.map(e => e.message).join(', '), 400));
    }

    const { email, password } = validationResult.data;

    const result = await authService.login(email, password);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Register (только для админов)
router.post('/register', registerRateLimiter, authenticateToken, requireRole(['ADMIN']), async (req: AuthRequest, res, next) => {
  try {
    // Validate input
    const validationResult = registerSchema.safeParse(req.body);
    if (!validationResult.success) {
      return next(createError('Validation failed: ' + validationResult.error.errors.map(e => e.message).join(', '), 400));
    }

    const { email, password, role } = validationResult.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return next(createError('User already exists', 409));
    }

    const newUser = await authService.register(email, password, role);

    res.status(201).json({
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Refresh token
router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return next(createError('Refresh token required', 400));
    }
    const result = await authService.refresh(refreshToken);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Logout
router.post('/logout', async (req, res) => {
  const { refreshToken } = req.body || {};
  if (refreshToken) {
    await authService.logout(refreshToken);
  }
  res.json({ message: 'Logged out successfully' });
});

// Get current user
router.get('/me', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      return next(createError('User not found', 404));
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { 
        teacher: true,
        student: true 
      },
    });

    if (!user) {
      return next(createError('User not found', 404));
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        teacher: user.teacher,
        student: user.student,
      },
    });
  } catch (error) {
    next(error);
  }
});

export { router as authRoutes };

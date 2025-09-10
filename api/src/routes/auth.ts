import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createError } from '../middleware/errorHandler';
import { AuthRequest, authenticateToken, requireRole } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router: Router = Router();
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "postgresql://postgres:Password1@localhost:5432/edu_flow?schema=public"
    }
  }
});

// Validation schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['ADMIN', 'TEACHER', 'STUDENT']),
});

// Login
router.post('/login', async (req, res, next) => {
  try {
    // Validate input
    const validationResult = loginSchema.safeParse(req.body);
    if (!validationResult.success) {
      return next(createError('Validation failed: ' + validationResult.error.errors.map(e => e.message).join(', '), 400));
    }

    const { email, password } = validationResult.data;

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email },
      include: { teacher: true },
    });

    if (!user) {
      return next(createError('Invalid credentials', 401));
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return next(createError('Invalid credentials', 401));
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return next(createError('JWT secret not configured', 500));
    }

    // Generate access token (short-lived)
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn: '15m' }
    );

    // Generate refresh token (long-lived)
    const refreshToken = jwt.sign(
      { id: user.id, type: 'refresh' },
      secret,
      { expiresIn: '7d' }
    );

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        teacher: user.teacher,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Register (только для админов)
router.post('/register', authenticateToken, requireRole(['ADMIN']), async (req: AuthRequest, res, next) => {
  try {
    // Validate input
    const validationResult = registerSchema.safeParse(req.body);
    if (!validationResult.success) {
      return next(createError('Validation failed: ' + validationResult.error.errors.map(e => e.message).join(', '), 400));
    }

    const { email, password, role } = validationResult.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return next(createError('User already exists', 409));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
      },
    });

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

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return next(createError('JWT secret not configured', 500));
    }

    jwt.verify(refreshToken, secret, async (err: any, decoded: any) => {
      if (err || decoded.type !== 'refresh') {
        return next(createError('Invalid refresh token', 403));
      }

      const user = await prisma.user.findUnique({
        where: { id: parseInt(decoded.id) },
        include: { teacher: true },
      });

      if (!user) {
        return next(createError('User not found', 404));
      }

      // Generate new access token
      const newAccessToken = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        secret,
        { expiresIn: '15m' }
      );

      res.json({
        accessToken: newAccessToken,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          teacher: user.teacher,
        },
      });
    });
  } catch (error) {
    next(error);
  }
});

// Logout
router.post('/logout', (req, res) => {
  // В реальном приложении здесь можно добавить blacklist для токенов
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

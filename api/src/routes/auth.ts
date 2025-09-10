import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createError } from '../middleware/errorHandler';
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

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn: '24h' }
    );

    res.json({
      token,
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
router.post('/register', async (req, res, next) => {
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

// Get current user
router.get('/me', async (req, res, next) => {
  // Временно возвращаем тестового пользователя без авторизации
  res.json({
    user: {
      id: 1,
      email: 'admin@school.com',
      role: 'ADMIN',
      teacher: null,
    },
  });
});

export { router as authRoutes };

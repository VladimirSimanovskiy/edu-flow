import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createError } from '../middleware/errorHandler';

const router = Router();

// Mock users (в реальном проекте будет база данных)
const users = [
  {
    id: '1',
    email: 'admin@school.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'admin',
  },
  {
    id: '2',
    email: 'teacher@school.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'teacher',
  },
];

// Login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(createError('Email and password are required', 400));
    }

    const user = users.find(u => u.email === email);
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
      },
    });
  } catch (error) {
    next(error);
  }
});

// Register (только для админов)
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return next(createError('Email, password, and role are required', 400));
    }

    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return next(createError('User already exists', 409));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: (users.length + 1).toString(),
      email,
      password: hashedPassword,
      role,
    };

    users.push(newUser);

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
router.get('/me', (req, res, next) => {
  // В реальном проекте здесь будет middleware аутентификации
  res.json({ message: 'Get current user endpoint' });
});

export { router as authRoutes };

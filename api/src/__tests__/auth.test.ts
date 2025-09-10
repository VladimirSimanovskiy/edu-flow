import request from 'supertest';
import express from 'express';
import { authRoutes } from '../routes/auth';
import { authenticateToken, requireRole } from '../middleware/auth';
import jwt from 'jsonwebtoken';

// Mock Prisma
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  })),
}));

// Mock bcrypt
jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

// Test route for middleware testing
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Protected route accessed', user: req.user });
});

app.get('/admin-only', authenticateToken, requireRole(['ADMIN']), (req, res) => {
  res.json({ message: 'Admin route accessed', user: req.user });
});

describe('Authentication', () => {
  const mockUser = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedpassword',
    role: 'ADMIN',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
  });

  describe('POST /auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const { PrismaClient } = require('@prisma/client');
      const bcrypt = require('bcryptjs');
      
      const mockPrisma = new PrismaClient();
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);

      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should return 401 for invalid credentials', async () => {
      const { PrismaClient } = require('@prisma/client');
      const bcrypt = require('bcryptjs');
      
      const mockPrisma = new PrismaClient();
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
    });

    it('should return 400 for invalid input', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'invalid-email',
          password: '123',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /auth/me', () => {
    it('should return user info with valid token', async () => {
      const token = jwt.sign(
        { id: 1, email: 'test@example.com', role: 'ADMIN' },
        'test-secret',
        { expiresIn: '15m' }
      );

      const { PrismaClient } = require('@prisma/client');
      const mockPrisma = new PrismaClient();
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const response = await request(app)
        .get('/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .get('/auth/me');

      expect(response.status).toBe(401);
    });

    it('should return 403 with invalid token', async () => {
      const response = await request(app)
        .get('/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(403);
    });
  });

  describe('POST /auth/refresh', () => {
    it('should refresh token successfully', async () => {
      const refreshToken = jwt.sign(
        { id: 1, type: 'refresh' },
        'test-secret',
        { expiresIn: '7d' }
      );

      const { PrismaClient } = require('@prisma/client');
      const mockPrisma = new PrismaClient();
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/auth/refresh')
        .send({ refreshToken });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('user');
    });

    it('should return 403 for invalid refresh token', async () => {
      const response = await request(app)
        .post('/auth/refresh')
        .send({ refreshToken: 'invalid-token' });

      expect(response.status).toBe(403);
    });
  });

  describe('Middleware Tests', () => {
    it('should access protected route with valid token', async () => {
      const token = jwt.sign(
        { id: 1, email: 'test@example.com', role: 'ADMIN' },
        'test-secret',
        { expiresIn: '15m' }
      );

      const response = await request(app)
        .get('/protected')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Protected route accessed');
    });

    it('should access admin route with admin role', async () => {
      const token = jwt.sign(
        { id: 1, email: 'test@example.com', role: 'ADMIN' },
        'test-secret',
        { expiresIn: '15m' }
      );

      const response = await request(app)
        .get('/admin-only')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Admin route accessed');
    });

    it('should deny access to admin route with non-admin role', async () => {
      const token = jwt.sign(
        { id: 1, email: 'test@example.com', role: 'TEACHER' },
        'test-secret',
        { expiresIn: '15m' }
      );

      const response = await request(app)
        .get('/admin-only')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
    });
  });
});

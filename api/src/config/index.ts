import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from api directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().url(),
  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
  JWT_ISSUER: z.string().optional(),
  JWT_AUDIENCE: z.string().optional(),
  BCRYPT_ROUNDS: z.string().regex(/^\d+$/).default('12'),
  RATE_LIMIT_WINDOW_MS: z.string().optional(),
  RATE_LIMIT_MAX_ATTEMPTS: z.string().optional(),
});

// Parse with defaults for missing values
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('❌ Environment validation failed:', parsed.error.issues);
  console.error('Please check your .env file');
  process.exit(1);
}
export const config = parsed.data;

export const securityConfig = {
  access: {
    secret: config.JWT_ACCESS_SECRET,
    expiresIn: '15m',
    issuer: config.JWT_ISSUER,
    audience: config.JWT_AUDIENCE,
    algorithm: 'HS256' as const,
  },
  refresh: {
    secret: config.JWT_REFRESH_SECRET,
    expiresIn: '7d',
    issuer: config.JWT_ISSUER,
    audience: config.JWT_AUDIENCE,
    algorithm: 'HS256' as const,
  },
  bcryptRounds: parseInt(config.BCRYPT_ROUNDS, 10),
};

export * from './database';

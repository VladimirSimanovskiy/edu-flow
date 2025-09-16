import { z } from 'zod';
import { UserRole } from '@prisma/client';

export const LoginRequestSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const RegisterRequestSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.nativeEnum(UserRole),
});

export type LoginRequestDTO = z.infer<typeof LoginRequestSchema>;
export type RegisterRequestDTO = z.infer<typeof RegisterRequestSchema>;



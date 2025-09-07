import { PrismaClient } from '../generated/prisma';

// Global Prisma client instance
export const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export * from './services/scheduleService';
export * from './services/teacherService';
export * from './services/classService';
export * from './types';

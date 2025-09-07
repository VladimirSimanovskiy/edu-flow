import { Router } from 'express';
import { createError } from '../middleware/errorHandler';
import { authenticateToken, requireRole } from '../middleware/auth';
import { PrismaClient } from '../../../db/generated/prisma';
import { z } from 'zod';

const router: Router = Router();
const prisma = new PrismaClient();

// Validation schemas
const lessonSchema = z.object({
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  dayOfWeek: z.number().min(0).max(6),
  weekNumber: z.number().optional(),
  teacherId: z.string().cuid(),
  classId: z.string().cuid(),
  subjectId: z.string().cuid(),
  classroomId: z.string().cuid(),
  scheduleVersionId: z.string().cuid(),
});

const lessonFiltersSchema = z.object({
  teacherId: z.string().cuid().optional(),
  classId: z.string().cuid().optional(),
  subjectId: z.string().cuid().optional(),
  dayOfWeek: z.number().min(0).max(6).optional(),
  weekNumber: z.number().optional(),
  scheduleVersionId: z.string().cuid().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

// Get all teachers
router.get('/teachers', authenticateToken, async (req, res, next) => {
  try {
    const teachers = await prisma.teacher.findMany({
      include: {
        user: true,
        lessons: {
          include: {
            class: true,
            subject: true,
            classroom: true,
            scheduleVersion: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    res.json(teachers);
  } catch (error) {
    next(error);
  }
});

// Get all classes
router.get('/classes', authenticateToken, async (req, res, next) => {
  try {
    const classes = await prisma.class.findMany({
      include: {
        lessons: {
          include: {
          teacher: {
            include: {
              user: true,
            },
          },
          scheduleVersion: true,
            subject: true,
            classroom: true,
          },
        },
      },
      orderBy: [
        { grade: 'asc' },
        { name: 'asc' },
      ],
    });

    res.json(classes);
  } catch (error) {
    next(error);
  }
});

// Get all subjects
router.get('/subjects', authenticateToken, async (req, res, next) => {
  try {
    const subjects = await prisma.subject.findMany({
      include: {
        lessons: {
          include: {
            teacher: true,
            class: true,
            classroom: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    res.json(subjects);
  } catch (error) {
    next(error);
  }
});

// Get all classrooms
router.get('/classrooms', authenticateToken, async (req, res, next) => {
  try {
    const classrooms = await prisma.classroom.findMany({
      include: {
        lessons: {
          include: {
            teacher: true,
            class: true,
            subject: true,
          },
        },
      },
      orderBy: {
        number: 'asc',
      },
    });

    res.json(classrooms);
  } catch (error) {
    next(error);
  }
});

// Get lessons with filters
router.get('/lessons', authenticateToken, async (req, res, next) => {
  try {
    const validationResult = lessonFiltersSchema.safeParse(req.query);
    if (!validationResult.success) {
      return next(createError('Validation failed: ' + validationResult.error.errors.map((e: any) => e.message).join(', '), 400));
    }

    const filters = validationResult.data;
    const where: any = {};

    if (filters.teacherId) where.teacherId = filters.teacherId;
    if (filters.classId) where.classId = filters.classId;
    if (filters.subjectId) where.subjectId = filters.subjectId;
    if (filters.dayOfWeek !== undefined) where.dayOfWeek = filters.dayOfWeek;
    if (filters.weekNumber !== undefined) where.weekNumber = filters.weekNumber;

    const lessons = await prisma.lesson.findMany({
      where,
      include: {
          teacher: {
            include: {
              user: true,
            },
          },
          scheduleVersion: true,
        class: true,
        subject: true,
        classroom: true,
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' },
      ],
    });

    res.json(lessons);
  } catch (error) {
    next(error);
  }
});

// Get lessons for a specific day
router.get('/lessons/day/:date', authenticateToken, async (req, res, next) => {
  try {
    const { date } = req.params;
    const { teacherId, classId } = req.query;

    const targetDate = new Date(date);
    const dayOfWeek = targetDate.getDay();

    const where: any = { dayOfWeek };
    if (teacherId) where.teacherId = teacherId as string;
    if (classId) where.classId = classId as string;

    const lessons = await prisma.lesson.findMany({
      where,
      include: {
          teacher: {
            include: {
              user: true,
            },
          },
          scheduleVersion: true,
        class: true,
        subject: true,
        classroom: true,
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    res.json(lessons);
  } catch (error) {
    next(error);
  }
});

// Get lessons for a specific week
router.get('/lessons/week/:date', authenticateToken, async (req, res, next) => {
  try {
    const { date } = req.params;
    const { teacherId, classId } = req.query;

    const targetDate = new Date(date);
    const weekNumber = Math.ceil(targetDate.getDate() / 7);

    const where: any = { weekNumber };
    if (teacherId) where.teacherId = teacherId as string;
    if (classId) where.classId = classId as string;

    const lessons = await prisma.lesson.findMany({
      where,
      include: {
          teacher: {
            include: {
              user: true,
            },
          },
          scheduleVersion: true,
        class: true,
        subject: true,
        classroom: true,
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' },
      ],
    });

    res.json(lessons);
  } catch (error) {
    next(error);
  }
});

// Create a new lesson
router.post('/lessons', authenticateToken, requireRole(['ADMIN', 'TEACHER']), async (req, res, next) => {
  try {
    const validationResult = lessonSchema.safeParse(req.body);
    if (!validationResult.success) {
      return next(createError('Validation failed: ' + validationResult.error.errors.map((e: any) => e.message).join(', '), 400));
    }

    const lessonData = validationResult.data;
    
    const newLesson = await prisma.lesson.create({
      data: lessonData,
      include: {
          teacher: {
            include: {
              user: true,
            },
          },
          scheduleVersion: true,
        class: true,
        subject: true,
        classroom: true,
      },
    });

    res.status(201).json(newLesson);
  } catch (error) {
    next(error);
  }
});

// Update a lesson
router.put('/lessons/:id', authenticateToken, requireRole(['ADMIN', 'TEACHER']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const validationResult = lessonSchema.partial().safeParse(req.body);
    
    if (!validationResult.success) {
      return next(createError('Validation failed: ' + validationResult.error.errors.map((e: any) => e.message).join(', '), 400));
    }

    const lessonData = validationResult.data;

    const existingLesson = await prisma.lesson.findUnique({
      where: { id },
    });

    if (!existingLesson) {
      return next(createError('Lesson not found', 404));
    }

    const updatedLesson = await prisma.lesson.update({
      where: { id },
      data: lessonData,
      include: {
          teacher: {
            include: {
              user: true,
            },
          },
          scheduleVersion: true,
        class: true,
        subject: true,
        classroom: true,
      },
    });

    res.json(updatedLesson);
  } catch (error) {
    next(error);
  }
});

// Delete a lesson
router.delete('/lessons/:id', authenticateToken, requireRole(['ADMIN', 'TEACHER']), async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingLesson = await prisma.lesson.findUnique({
      where: { id },
    });

    if (!existingLesson) {
      return next(createError('Lesson not found', 404));
    }

    await prisma.lesson.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export { router as scheduleRoutes };

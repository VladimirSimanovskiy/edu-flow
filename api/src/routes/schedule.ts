import { Router } from 'express';
import { createError } from '../middleware/errorHandler';
import { authenticateToken, requireRole } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { ScheduleController } from '../controllers/schedule.controller';

const router: Router = Router();
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

const scheduleController = new ScheduleController(prisma);

// Validation schemas
const lessonSchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  idTeacher: z.number().int().positive(),
  idClass: z.number().int().positive(),
  idSubject: z.number().int().positive(),
  idClassroom: z.number().int().positive(),
  idLessonSchedule: z.number().int().positive(),
  idScheduleVersion: z.number().int().positive(),
});

const lessonFiltersSchema = z.object({
  idTeacher: z.number().int().positive().optional(),
  idClass: z.number().int().positive().optional(),
  idSubject: z.number().int().positive().optional(),
  dayOfWeek: z.number().min(0).max(6).optional(),
  idScheduleVersion: z.number().int().positive().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  date: z.string().datetime().optional(),
});


// Get all teachers
router.get('/teachers', authenticateToken, scheduleController.getTeachers.bind(scheduleController));

// Get all classes
router.get('/classes', authenticateToken, scheduleController.getClasses.bind(scheduleController));

// Get all subjects
router.get('/subjects', authenticateToken, scheduleController.getSubjects.bind(scheduleController));

// Get all classrooms
router.get('/classrooms', authenticateToken, scheduleController.getClassrooms.bind(scheduleController));

// Get lessons with filters
router.get('/lessons', authenticateToken, scheduleController.getLessons.bind(scheduleController));

// Get lessons for a specific day
router.get('/lessons/day/:date', authenticateToken, scheduleController.getLessonsForDay.bind(scheduleController));

// Get lessons for a specific week
router.get('/lessons/week/:date', authenticateToken, scheduleController.getLessonsForWeek.bind(scheduleController));

// Create a new lesson
router.post('/lessons', authenticateToken, requireRole(['ADMIN']), async (req, res, next) => {
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
        class: true,
        subject: true,
        classroom: true,
        lessonSchedule: true,
        scheduleVersion: true,
      },
    });

    res.status(201).json(newLesson);
  } catch (error) {
    next(error);
  }
});

// Update a lesson
router.put('/lessons/:id', authenticateToken, requireRole(['ADMIN']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const validationResult = lessonSchema.partial().safeParse(req.body);
    
    if (!validationResult.success) {
      return next(createError('Validation failed: ' + validationResult.error.errors.map((e: any) => e.message).join(', '), 400));
    }

    const lessonData = validationResult.data;

    const existingLesson = await prisma.lesson.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingLesson) {
      return next(createError('Lesson not found', 404));
    }

    const updatedLesson = await prisma.lesson.update({
      where: { id: parseInt(id) },
      data: lessonData,
      include: {
        teacher: {
          include: {
            user: true,
          },
        },
        class: true,
        subject: true,
        classroom: true,
        lessonSchedule: true,
        scheduleVersion: true,
      },
    });

    res.json(updatedLesson);
  } catch (error) {
    next(error);
  }
});

// Delete a lesson
router.delete('/lessons/:id', authenticateToken, requireRole(['ADMIN']), async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingLesson = await prisma.lesson.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingLesson) {
      return next(createError('Lesson not found', 404));
    }

    await prisma.lesson.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// Get lesson schedules
router.get('/lesson-schedules', authenticateToken, scheduleController.getLessonSchedules.bind(scheduleController));

// Get schedule versions
router.get('/schedule-versions', authenticateToken, scheduleController.getScheduleVersions.bind(scheduleController));

// Get current schedule version
router.get('/schedule-versions/current', authenticateToken, scheduleController.getCurrentScheduleVersion.bind(scheduleController));


export { router as scheduleRoutes };

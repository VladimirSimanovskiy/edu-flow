import { Router } from 'express';
import { createError } from '../middleware/errorHandler';
// import { /* authenticateToken */, requireRole } from '../middleware/auth';
import { PrismaClient } from '../../../db/generated/prisma';
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
router.get('/teachers',  async (req, res, next) => {
  try {
    const teachers = await prisma.teacher.findMany({
      include: {
        user: true,
        lessons: {
          include: {
            class: true,
            subject: true,
            classroom: true,
            lessonSchedule: true,
            scheduleVersion: true,
          },
        },
        subjects: {
          include: {
            subject: true,
          },
        },
      },
      orderBy: {
        lastName: 'asc',
      },
    });

    res.json(teachers);
  } catch (error) {
    next(error);
  }
});

// Get all classes
router.get('/classes', async (req, res, next) => {
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
            subject: true,
            classroom: true,
            lessonSchedule: true,
            scheduleVersion: true,
          },
        },
        classLeader: {
          include: {
            user: true,
          },
        },
      },
      orderBy: [
        { grade: 'asc' },
        { letter: 'asc' },
      ],
    });

    res.json(classes);
  } catch (error) {
    next(error);
  }
});

// Get all subjects
router.get('/subjects', async (req, res, next) => {
  try {
    const subjects = await prisma.subject.findMany({
      include: {
        lessons: {
          include: {
            teacher: {
              include: {
                user: true,
              },
            },
            class: true,
            classroom: true,
            lessonSchedule: true,
            scheduleVersion: true,
          },
        },
        teacherSubjects: {
          include: {
            teacher: {
              include: {
                user: true,
              },
            },
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
router.get('/classrooms', async (req, res, next) => {
  try {
    const classrooms = await prisma.classroom.findMany({
      include: {
        lessons: {
          include: {
            teacher: {
              include: {
                user: true,
              },
            },
            class: true,
            subject: true,
            lessonSchedule: true,
            scheduleVersion: true,
          },
        },
        assignedTeachers: {
          include: {
            user: true,
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
router.get('/lessons', async (req, res, next) => {
  try {
    const validationResult = lessonFiltersSchema.safeParse(req.query);
    if (!validationResult.success) {
      return next(createError('Validation failed: ' + validationResult.error.errors.map((e: any) => e.message).join(', '), 400));
    }

    const filters = validationResult.data;
    const where: any = {};

    if (filters.idTeacher) where.idTeacher = filters.idTeacher;
    if (filters.idClass) where.idClass = filters.idClass;
    if (filters.idSubject) where.idSubject = filters.idSubject;
    if (filters.dayOfWeek !== undefined) where.dayOfWeek = filters.dayOfWeek;
    if (filters.idScheduleVersion) where.idScheduleVersion = filters.idScheduleVersion;

    // If date is provided, get lessons from the current schedule version for that date
    if (filters.date) {
      const currentVersion = await prisma.scheduleVersion.findFirst({
        where: {
          AND: [
            { dateBegin: { lte: new Date(filters.date) } },
            {
              OR: [
                { dateEnd: null },
                { dateEnd: { gte: new Date(filters.date) } },
              ],
            },
          ],
        },
        orderBy: { dateBegin: 'desc' },
      });
      if (currentVersion) {
        where.idScheduleVersion = currentVersion.id;
      } else {
        return res.json([]);
      }
    }

    const lessons = await prisma.lesson.findMany({
      where,
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
      orderBy: [
        { dayOfWeek: 'asc' },
        { lessonSchedule: { lessonNumber: 'asc' } },
      ],
    });

    res.json(lessons);
  } catch (error) {
    next(error);
  }
});

// Get lessons for a specific day
router.get('/lessons/day/:date', async (req, res, next) => {
  try {
    const { date } = req.params;
    const { idTeacher, idClass } = req.query;

    // Парсим дату из строки YYYY-MM-DD
    const [year, month, day] = date.split('-').map(Number);
    const targetDate = new Date(year, month - 1, day); // month - 1, так как месяцы в JS начинаются с 0
    // Приводим день недели к стандарту базы данных (понедельник = 1, воскресенье = 7)
    const dayOfWeek = targetDate.getDay() === 0 ? 7 : targetDate.getDay();


    // Get current schedule version for the date
    const currentVersion = await prisma.scheduleVersion.findFirst({
      where: {
        AND: [
          { dateBegin: { lte: targetDate } },
          {
            OR: [
              { dateEnd: null },
              { dateEnd: { gte: targetDate } },
            ],
          },
        ],
      },
      orderBy: { dateBegin: 'desc' },
    });

    if (!currentVersion) {
      return res.json([]);
    }

    const where: any = { 
      dayOfWeek,
      idScheduleVersion: currentVersion.id,
    };
    if (idTeacher) where.idTeacher = parseInt(idTeacher as string);
    if (idClass) where.idClass = parseInt(idClass as string);

    const lessons = await prisma.lesson.findMany({
      where,
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
      orderBy: {
        lessonSchedule: { lessonNumber: 'asc' },
      },
    });

    res.json(lessons);
  } catch (error) {
    next(error);
  }
});

// Get lessons for a specific week
router.get('/lessons/week/:date', async (req, res, next) => {
  try {
    const { date } = req.params;
    const { idTeacher, idClass } = req.query;

    // Парсим дату из строки YYYY-MM-DD
    const [year, month, day] = date.split('-').map(Number);
    const targetDate = new Date(year, month - 1, day); // month - 1, так как месяцы в JS начинаются с 0
    const startOfWeek = new Date(targetDate);
    startOfWeek.setDate(targetDate.getDate() - targetDate.getDay() + 1); // Monday
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday

    // Get current schedule version for the week
    const currentVersion = await prisma.scheduleVersion.findFirst({
      where: {
        AND: [
          { dateBegin: { lte: endOfWeek } },
          {
            OR: [
              { dateEnd: null },
              { dateEnd: { gte: startOfWeek } },
            ],
          },
        ],
      },
      orderBy: { dateBegin: 'desc' },
    });

    if (!currentVersion) {
      return res.json([]);
    }

    const where: any = { 
      idScheduleVersion: currentVersion.id,
    };
    if (idTeacher) where.idTeacher = parseInt(idTeacher as string);
    if (idClass) where.idClass = parseInt(idClass as string);

    const lessons = await prisma.lesson.findMany({
      where,
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
      orderBy: [
        { dayOfWeek: 'asc' },
        { lessonSchedule: { lessonNumber: 'asc' } },
      ],
    });

    res.json(lessons);
  } catch (error) {
    next(error);
  }
});

// Create a new lesson
router.post('/lessons', async (req, res, next) => {
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
router.put('/lessons/:id', async (req, res, next) => {
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
router.delete('/lessons/:id', async (req, res, next) => {
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
router.get('/lesson-schedules', async (req, res, next) => {
  try {
    const lessonSchedules = await prisma.lessonSchedule.findMany({
      include: {
        lessons: {
          include: {
            teacher: {
              include: {
                user: true,
              },
            },
            class: true,
            subject: true,
            classroom: true,
            scheduleVersion: true,
          },
        },
      },
      orderBy: {
        lessonNumber: 'asc',
      },
    });

    res.json(lessonSchedules);
  } catch (error) {
    next(error);
  }
});

// Get schedule versions
router.get('/schedule-versions', async (req, res, next) => {
  try {
    const scheduleVersions = await prisma.scheduleVersion.findMany({
      include: {
        lessons: {
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
          },
        },
      },
      orderBy: {
        dateBegin: 'desc',
      },
    });

    res.json(scheduleVersions);
  } catch (error) {
    next(error);
  }
});

// Get current schedule version
router.get('/schedule-versions/current', async (req, res, next) => {
  try {
    const today = new Date();
    const currentVersion = await prisma.scheduleVersion.findFirst({
      where: {
        AND: [
          { dateBegin: { lte: today } },
          {
            OR: [
              { dateEnd: null },
              { dateEnd: { gte: today } },
            ],
          },
        ],
      },
      include: {
        lessons: {
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
          },
        },
      },
      orderBy: { dateBegin: 'desc' },
    });

    if (!currentVersion) {
      return res.status(404).json({ error: 'No current schedule version found' });
    }

    res.json(currentVersion);
  } catch (error) {
    next(error);
  }
});


export { router as scheduleRoutes };

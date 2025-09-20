import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { createError } from '../middleware/errorHandler';
import { LessonFilterService } from '../services/filters';

export class ScheduleController {
  private prisma: PrismaClient;
  private filterService: LessonFilterService;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.filterService = new LessonFilterService();
  }

  /**
   * Получить всех учителей
   */
  async getTeachers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const teachers = await this.prisma.teacher.findMany({
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
  }

  /**
   * Получить все классы
   */
  async getClasses(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const classes = await this.prisma.class.findMany({
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
  }

  /**
   * Получить все предметы
   */
  async getSubjects(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const subjects = await this.prisma.subject.findMany({
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
  }

  /**
   * Получить все аудитории
   */
  async getClassrooms(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const classrooms = await this.prisma.classroom.findMany({
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
  }

  /**
   * Получить уроки с фильтрами
   */
  async getLessons(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { where } = await this.filterService.buildCompleteFilter(
        this.prisma,
        req.query,
        req.query.date as string
      );

      const lessons = await this.prisma.lesson.findMany({
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
  }

  /**
   * Получить уроки для конкретного дня
   */
  async getLessonsForDay(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { date } = req.params;
      
      // Валидируем формат даты
      if (!this.isValidDateFormat(date)) {
        return next(createError('Invalid date format. Expected YYYY-MM-DD', 400));
      }

      // Границы дня для выборки замещений
      const dayStart = new Date(`${date}T00:00:00.000Z`);
      const dayEnd = new Date(`${date}T23:59:59.999Z`);

      const where = await this.filterService.buildDayFilter(
        this.prisma,
        date,
        req.query
      );

      const lessons = await this.prisma.lesson.findMany({
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
          substitutions: {
            where: {
              date: {
                gte: dayStart,
                lt: dayEnd,
              },
            },
            include: {
              teacher: {
                include: {
                  user: true,
                },
              },
              classroom: true,
            },
          },
        },
        orderBy: {
          lessonSchedule: { lessonNumber: 'asc' },
        },
      });

      res.json(lessons);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Получить уроки для недели
   */
  async getLessonsForWeek(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { date } = req.params;
      
      // Валидируем формат даты
      if (!this.isValidDateFormat(date)) {
        return next(createError('Invalid date format. Expected YYYY-MM-DD', 400));
      }

      // Вычисляем границы недели (понедельник - воскресенье) для выборки замещений
      const base = new Date(`${date}T00:00:00.000Z`);
      const day = base.getUTCDay(); // 0=Sun..6=Sat
      const diffToMonday = (day === 0 ? -6 : 1 - day); // adjust to Monday
      const weekStart = new Date(base);
      weekStart.setUTCDate(base.getUTCDate() + diffToMonday);
      const weekEnd = new Date(weekStart);
      weekEnd.setUTCDate(weekStart.getUTCDate() + 6);
      weekEnd.setUTCHours(23, 59, 59, 999);

      const where = await this.filterService.buildWeekFilter(
        this.prisma,
        date,
        req.query
      );

      const lessons = await this.prisma.lesson.findMany({
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
          substitutions: {
            where: {
              date: {
                gte: weekStart,
                lte: weekEnd,
              },
            },
            include: {
              teacher: {
                include: {
                  user: true,
                },
              },
              classroom: true,
            },
          },
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
  }

  /**
   * Получить расписания уроков
   */
  async getLessonSchedules(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const lessonSchedules = await this.prisma.lessonSchedule.findMany({
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
  }

  /**
   * Получить версии расписания
   */
  async getScheduleVersions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const scheduleVersions = await this.prisma.scheduleVersion.findMany({
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
  }

  /**
   * Получить текущую версию расписания
   */
  async getCurrentScheduleVersion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const today = new Date();
      const currentVersion = await this.prisma.scheduleVersion.findFirst({
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
        res.status(404).json({ error: 'No current schedule version found' });
        return;
      }

      res.json(currentVersion);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Валидирует формат даты YYYY-MM-DD
   */
  private isValidDateFormat(date: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(date)) {
      return false;
    }
    
    const parsedDate = new Date(date);
    return parsedDate.toISOString().split('T')[0] === date;
  }
}

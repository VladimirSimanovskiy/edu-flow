import { prisma } from '../index';
import { Lesson, Prisma } from '../../generated/prisma';

export interface CreateLessonData {
  startTime: string;
  endTime: string;
  dayOfWeek: number;
  weekNumber?: number;
  teacherId: string;
  classId: string;
  subjectId: string;
  classroomId: string;
}

export interface UpdateLessonData extends Partial<CreateLessonData> {
  id: string;
}

export interface LessonFilters {
  teacherId?: string;
  classId?: string;
  subjectId?: string;
  dayOfWeek?: number;
  weekNumber?: number;
  startDate?: Date;
  endDate?: Date;
}

export class ScheduleService {
  // Create a new lesson
  static async createLesson(data: CreateLessonData): Promise<Lesson> {
    return await prisma.lesson.create({
      data,
      include: {
        teacher: true,
        class: true,
        subject: true,
        classroom: true,
      },
    });
  }

  // Get lesson by ID
  static async getLessonById(id: string): Promise<Lesson | null> {
    return await prisma.lesson.findUnique({
      where: { id },
      include: {
        teacher: true,
        class: true,
        subject: true,
        classroom: true,
      },
    });
  }

  // Update lesson
  static async updateLesson(data: UpdateLessonData): Promise<Lesson> {
    const { id, ...updateData } = data;
    return await prisma.lesson.update({
      where: { id },
      data: updateData,
      include: {
        teacher: true,
        class: true,
        subject: true,
        classroom: true,
      },
    });
  }

  // Delete lesson
  static async deleteLesson(id: string): Promise<void> {
    await prisma.lesson.delete({
      where: { id },
    });
  }

  // Get lessons with filters
  static async getLessons(filters: LessonFilters = {}): Promise<Lesson[]> {
    const where: Prisma.LessonWhereInput = {};

    if (filters.teacherId) {
      where.teacherId = filters.teacherId;
    }

    if (filters.classId) {
      where.classId = filters.classId;
    }

    if (filters.subjectId) {
      where.subjectId = filters.subjectId;
    }

    if (filters.dayOfWeek !== undefined) {
      where.dayOfWeek = filters.dayOfWeek;
    }

    if (filters.weekNumber !== undefined) {
      where.weekNumber = filters.weekNumber;
    }

    return await prisma.lesson.findMany({
      where,
      include: {
        teacher: true,
        class: true,
        subject: true,
        classroom: true,
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' },
      ],
    });
  }

  // Get lessons for a specific day
  static async getLessonsForDay(date: Date, filters: Omit<LessonFilters, 'dayOfWeek'> = {}): Promise<Lesson[]> {
    const dayOfWeek = date.getDay();
    return await this.getLessons({
      ...filters,
      dayOfWeek,
    });
  }

  // Get lessons for a specific week
  static async getLessonsForWeek(date: Date, filters: Omit<LessonFilters, 'weekNumber'> = {}): Promise<Lesson[]> {
    const weekNumber = Math.ceil(date.getDate() / 7);
    return await this.getLessons({
      ...filters,
      weekNumber,
    });
  }

  // Get lessons for a date range
  static async getLessonsForDateRange(
    startDate: Date,
    endDate: Date,
    filters: Omit<LessonFilters, 'startDate' | 'endDate'> = {}
  ): Promise<Lesson[]> {
    const lessons: Lesson[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayLessons = await this.getLessonsForDay(currentDate, filters);
      lessons.push(...dayLessons);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return lessons;
  }

  // Get teacher's schedule
  static async getTeacherSchedule(teacherId: string, filters: Omit<LessonFilters, 'teacherId'> = {}): Promise<Lesson[]> {
    return await this.getLessons({
      ...filters,
      teacherId,
    });
  }

  // Get class schedule
  static async getClassSchedule(classId: string, filters: Omit<LessonFilters, 'classId'> = {}): Promise<Lesson[]> {
    return await this.getLessons({
      ...filters,
      classId,
    });
  }
}

import { prisma } from '../index';

// Temporary types until Prisma client is generated
interface Lesson {
  id: number;
  dayOfWeek: number;
  idTeacher: number;
  idClass: number;
  idSubject: number;
  idClassroom: number;
  idLessonSchedule: number;
  idScheduleVersion: number;
  teacher?: any;
  class?: any;
  subject?: any;
  classroom?: any;
  lessonSchedule?: any;
  scheduleVersion?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLessonData {
  dayOfWeek: number;
  idTeacher: number;
  idClass: number;
  idSubject: number;
  idClassroom: number;
  idLessonSchedule: number;
  idScheduleVersion: number;
}

export interface UpdateLessonData extends Partial<CreateLessonData> {
  id: number;
}

export interface LessonFilters {
  idTeacher?: number;
  idClass?: number;
  idSubject?: number;
  dayOfWeek?: number;
  idScheduleVersion?: number;
  startDate?: Date;
  endDate?: Date;
  date?: Date; // Get lessons for specific date
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
        lessonSchedule: true,
        scheduleVersion: true,
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
        lessonSchedule: true,
        scheduleVersion: true,
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
        lessonSchedule: true,
        scheduleVersion: true,
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
    const where: Record<string, any> = {};

    if (filters.idTeacher) {
      where.idTeacher = filters.idTeacher;
    }

    if (filters.idClass) {
      where.idClass = filters.idClass;
    }

    if (filters.idSubject) {
      where.idSubject = filters.idSubject;
    }

    if (filters.dayOfWeek !== undefined) {
      where.dayOfWeek = filters.dayOfWeek;
    }

    if (filters.idScheduleVersion) {
      where.idScheduleVersion = filters.idScheduleVersion;
    }

    // If date is provided, get lessons from the current schedule version for that date
    if (filters.date) {
      const { ScheduleVersionService } = await import('./scheduleVersionService');
      const currentVersion = await ScheduleVersionService.getScheduleVersionForDate(filters.date);
      if (currentVersion) {
        where.idScheduleVersion = currentVersion.id;
      } else {
        // If no current version for the date, return empty array
        return [];
      }
    }

    return await prisma.lesson.findMany({
      where,
      include: {
        teacher: true,
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
  static async getLessonsForWeek(date: Date, filters: Omit<LessonFilters, 'dayOfWeek'> = {}): Promise<Lesson[]> {
    // For now, we'll get all lessons for the week (Monday to Sunday)
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay() + 1); // Monday
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday
    
    return await this.getLessonsForDateRange(startOfWeek, endOfWeek, filters);
  }


  // Get teacher's schedule
  static async getTeacherSchedule(idTeacher: number, filters: Omit<LessonFilters, 'idTeacher'> = {}): Promise<Lesson[]> {
    return await this.getLessons({
      ...filters,
      idTeacher,
    });
  }

  // Get class schedule
  static async getClassSchedule(idClass: number, filters: Omit<LessonFilters, 'idClass'> = {}): Promise<Lesson[]> {
    return await this.getLessons({
      ...filters,
      idClass,
    });
  }

  // Get lessons for current schedule version
  static async getCurrentLessons(filters: Omit<LessonFilters, 'idScheduleVersion' | 'date'> = {}): Promise<Lesson[]> {
    const { ScheduleVersionService } = await import('./scheduleVersionService');
    const currentVersion = await ScheduleVersionService.getCurrentScheduleVersion();
    
    if (!currentVersion) {
      return [];
    }

    return await this.getLessons({
      ...filters,
      idScheduleVersion: currentVersion.id,
    });
  }

  // Get lessons for a specific schedule version
  static async getLessonsForVersion(versionId: number, filters: Omit<LessonFilters, 'idScheduleVersion'> = {}): Promise<Lesson[]> {
    return await this.getLessons({
      ...filters,
      idScheduleVersion: versionId,
    });
  }

  // Get lessons for a specific date (automatically determines the correct version)
  static async getLessonsForDate(date: Date, filters: Omit<LessonFilters, 'date'> = {}): Promise<Lesson[]> {
    return await this.getLessons({
      ...filters,
      date,
    });
  }

  // Get lessons for a date range (handles multiple versions if needed)
  static async getLessonsForDateRange(
    startDate: Date,
    endDate: Date,
    filters: Omit<LessonFilters, 'startDate' | 'endDate' | 'date'> = {}
  ): Promise<Lesson[]> {
    const { ScheduleVersionService } = await import('./scheduleVersionService');
    const lessons: Lesson[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayLessons = await this.getLessonsForDate(currentDate, filters);
      lessons.push(...dayLessons);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return lessons;
  }

  // Get teacher's schedule for current version
  static async getCurrentTeacherSchedule(idTeacher: number, filters: Omit<LessonFilters, 'idTeacher' | 'idScheduleVersion' | 'date'> = {}): Promise<Lesson[]> {
    return await this.getCurrentLessons({
      ...filters,
      idTeacher,
    });
  }

  // Get class schedule for current version
  static async getCurrentClassSchedule(idClass: number, filters: Omit<LessonFilters, 'idClass' | 'idScheduleVersion' | 'date'> = {}): Promise<Lesson[]> {
    return await this.getCurrentLessons({
      ...filters,
      idClass,
    });
  }

  // Get teacher's schedule for a specific date
  static async getTeacherScheduleForDate(idTeacher: number, date: Date, filters: Omit<LessonFilters, 'idTeacher' | 'date'> = {}): Promise<Lesson[]> {
    return await this.getLessonsForDate(date, {
      ...filters,
      idTeacher,
    });
  }

  // Get class schedule for a specific date
  static async getClassScheduleForDate(idClass: number, date: Date, filters: Omit<LessonFilters, 'idClass' | 'date'> = {}): Promise<Lesson[]> {
    return await this.getLessonsForDate(date, {
      ...filters,
      idClass,
    });
  }
}

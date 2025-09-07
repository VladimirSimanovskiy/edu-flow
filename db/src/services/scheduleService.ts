import { prisma } from '../index';

// Temporary types until Prisma client is generated
interface Lesson {
  id: string;
  startTime: string;
  endTime: string;
  dayOfWeek: number;
  weekNumber?: number | null;
  teacherId: string;
  classId: string;
  subjectId: string;
  classroomId: string;
  scheduleVersionId: string;
  teacher?: any;
  class?: any;
  subject?: any;
  classroom?: any;
  scheduleVersion?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLessonData {
  startTime: string;
  endTime: string;
  dayOfWeek: number;
  weekNumber?: number;
  teacherId: string;
  classId: string;
  subjectId: string;
  classroomId: string;
  scheduleVersionId: string;
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
  scheduleVersionId?: string;
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

    if (filters.scheduleVersionId) {
      where.scheduleVersionId = filters.scheduleVersionId;
    }

    // If date is provided, get lessons from the current schedule version for that date
    if (filters.date) {
      const { ScheduleVersionService } = await import('./scheduleVersionService');
      const currentVersion = await ScheduleVersionService.getScheduleVersionForDate(filters.date);
      if (currentVersion) {
        where.scheduleVersionId = currentVersion.id;
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
        scheduleVersion: true,
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

  // Get lessons for current schedule version
  static async getCurrentLessons(filters: Omit<LessonFilters, 'scheduleVersionId' | 'date'> = {}): Promise<Lesson[]> {
    const { ScheduleVersionService } = await import('./scheduleVersionService');
    const currentVersion = await ScheduleVersionService.getCurrentScheduleVersion();
    
    if (!currentVersion) {
      return [];
    }

    return await this.getLessons({
      ...filters,
      scheduleVersionId: currentVersion.id,
    });
  }

  // Get lessons for a specific schedule version
  static async getLessonsForVersion(versionId: string, filters: Omit<LessonFilters, 'scheduleVersionId'> = {}): Promise<Lesson[]> {
    return await this.getLessons({
      ...filters,
      scheduleVersionId: versionId,
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
  static async getCurrentTeacherSchedule(teacherId: string, filters: Omit<LessonFilters, 'teacherId' | 'scheduleVersionId' | 'date'> = {}): Promise<Lesson[]> {
    return await this.getCurrentLessons({
      ...filters,
      teacherId,
    });
  }

  // Get class schedule for current version
  static async getCurrentClassSchedule(classId: string, filters: Omit<LessonFilters, 'classId' | 'scheduleVersionId' | 'date'> = {}): Promise<Lesson[]> {
    return await this.getCurrentLessons({
      ...filters,
      classId,
    });
  }

  // Get teacher's schedule for a specific date
  static async getTeacherScheduleForDate(teacherId: string, date: Date, filters: Omit<LessonFilters, 'teacherId' | 'date'> = {}): Promise<Lesson[]> {
    return await this.getLessonsForDate(date, {
      ...filters,
      teacherId,
    });
  }

  // Get class schedule for a specific date
  static async getClassScheduleForDate(classId: string, date: Date, filters: Omit<LessonFilters, 'classId' | 'date'> = {}): Promise<Lesson[]> {
    return await this.getLessonsForDate(date, {
      ...filters,
      classId,
    });
  }
}

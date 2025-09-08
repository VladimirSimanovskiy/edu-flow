import { prisma } from '../index';

// Temporary types until Prisma client is generated
interface ScheduleVersion {
  id: number;
  dateBegin: Date;
  dateEnd?: Date | null;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
  lessons: Lesson[];
}

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
  scheduleVersion?: ScheduleVersion;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateScheduleVersionData {
  dateBegin: Date;
  dateEnd?: Date;
  description?: string;
}

export interface UpdateScheduleVersionData extends Partial<CreateScheduleVersionData> {
  id: number;
}

export interface ScheduleVersionFilters {
  dateBegin?: Date;
  dateEnd?: Date;
  description?: string;
}

export class ScheduleVersionService {
  // Create a new schedule version
  static async createScheduleVersion(data: CreateScheduleVersionData): Promise<ScheduleVersion> {
    return await prisma.scheduleVersion.create({
      data: {
        dateBegin: data.dateBegin,
        dateEnd: data.dateEnd,
        description: data.description,
      },
      include: {
        lessons: {
          include: {
            teacher: true,
            class: true,
            subject: true,
            classroom: true,
            lessonSchedule: true,
          },
        },
      },
    });
  }

  // Get schedule version by ID
  static async getScheduleVersionById(id: number): Promise<ScheduleVersion | null> {
    return await prisma.scheduleVersion.findUnique({
      where: { id },
      include: {
        lessons: {
          include: {
            teacher: true,
            class: true,
            subject: true,
            classroom: true,
            lessonSchedule: true,
          },
        },
      },
    });
  }

  // Update schedule version
  static async updateScheduleVersion(data: UpdateScheduleVersionData): Promise<ScheduleVersion> {
    const { id, ...updateData } = data;
    return await prisma.scheduleVersion.update({
      where: { id },
      data: updateData,
      include: {
        lessons: {
          include: {
            teacher: true,
            class: true,
            subject: true,
            classroom: true,
            lessonSchedule: true,
          },
        },
      },
    });
  }

  // Delete schedule version (cascades to lessons)
  static async deleteScheduleVersion(id: number): Promise<void> {
    await prisma.scheduleVersion.delete({
      where: { id },
    });
  }

  // Get all schedule versions
  static async getScheduleVersions(filters: ScheduleVersionFilters = {}): Promise<ScheduleVersion[]> {
    const where: Record<string, any> = {};

    if (filters.dateBegin) {
      where.dateBegin = {
        gte: filters.dateBegin,
      };
    }

    if (filters.dateEnd) {
      where.dateEnd = {
        lte: filters.dateEnd,
      };
    }

    if (filters.description) {
      where.description = {
        contains: filters.description,
        mode: 'insensitive',
      };
    }

    return await prisma.scheduleVersion.findMany({
      where,
      include: {
        lessons: {
          include: {
            teacher: true,
            class: true,
            subject: true,
            classroom: true,
            lessonSchedule: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get current active schedule version (the one that covers today's date)
  static async getCurrentScheduleVersion(): Promise<ScheduleVersion | null> {
    const today = new Date();
    return await prisma.scheduleVersion.findFirst({
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
            teacher: true,
            class: true,
            subject: true,
            classroom: true,
            lessonSchedule: true,
          },
        },
      },
      orderBy: { dateBegin: 'desc' },
    });
  }

  // Get schedule version for a specific date
  static async getScheduleVersionForDate(date: Date = new Date()): Promise<ScheduleVersion | null> {
    return await prisma.scheduleVersion.findFirst({
      where: {
        AND: [
          { dateBegin: { lte: date } },
          {
            OR: [
              { dateEnd: null },
              { dateEnd: { gte: date } },
            ],
          },
        ],
      },
      include: {
        lessons: {
          include: {
            teacher: true,
            class: true,
            subject: true,
            classroom: true,
            lessonSchedule: true,
          },
        },
      },
      orderBy: { dateBegin: 'desc' },
    });
  }

  // Copy lessons from one schedule version to another
  static async copyLessonsBetweenVersions(
    fromVersionId: number,
    toVersionId: number
  ): Promise<void> {
    const fromVersion = await this.getScheduleVersionById(fromVersionId);
    if (!fromVersion) {
      throw new Error('Source schedule version not found');
    }

    const toVersion = await this.getScheduleVersionById(toVersionId);
    if (!toVersion) {
      throw new Error('Target schedule version not found');
    }

    await prisma.$transaction(async (tx) => {
      for (const lesson of fromVersion.lessons) {
        await tx.lesson.create({
          data: {
            dayOfWeek: lesson.dayOfWeek,
            idTeacher: lesson.idTeacher,
            idClass: lesson.idClass,
            idSubject: lesson.idSubject,
            idClassroom: lesson.idClassroom,
            idLessonSchedule: lesson.idLessonSchedule,
            idScheduleVersion: toVersionId,
          },
        });
      }
    });
  }
}

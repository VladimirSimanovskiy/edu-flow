import { prisma } from '../index';

// Temporary types until Prisma client is generated
interface ScheduleVersion {
  id: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  periods: SchedulePeriod[];
  lessons: Lesson[];
}

interface SchedulePeriod {
  id: string;
  startDate: Date;
  endDate: Date;
  isCurrent: boolean;
  scheduleVersionId: string;
  scheduleVersion?: ScheduleVersion;
  createdAt: Date;
  updatedAt: Date;
}

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
  scheduleVersion?: ScheduleVersion;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateScheduleVersionData {
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
}

export interface UpdateScheduleVersionData extends Partial<CreateScheduleVersionData> {
  id: string;
}

export interface CreateSchedulePeriodData {
  scheduleVersionId: string;
  startDate: Date;
  endDate: Date;
}

export interface UpdateSchedulePeriodData extends Partial<CreateSchedulePeriodData> {
  id: string;
}

export interface ScheduleVersionFilters {
  isActive?: boolean;
  name?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface SchedulePeriodFilters {
  scheduleVersionId?: string;
  isCurrent?: boolean;
  startDate?: Date;
  endDate?: Date;
  date?: Date; // Get period for specific date
}

export class ScheduleVersionService {
  // Create a new schedule version with period
  static async createScheduleVersion(data: CreateScheduleVersionData): Promise<ScheduleVersion> {
    return await prisma.$transaction(async (tx) => {
      // Create the schedule version
      const scheduleVersion = await tx.scheduleVersion.create({
        data: {
          name: data.name,
          description: data.description,
        },
        include: {
          periods: true,
          lessons: true,
        },
      });

      // Create the period for this version
      await tx.schedulePeriod.create({
        data: {
          scheduleVersionId: scheduleVersion.id,
          startDate: data.startDate,
          endDate: data.endDate,
        },
      });

      return scheduleVersion;
    });
  }

  // Get schedule version by ID
  static async getScheduleVersionById(id: string): Promise<ScheduleVersion | null> {
    return await prisma.scheduleVersion.findUnique({
      where: { id },
      include: {
        periods: {
          orderBy: { startDate: 'asc' },
        },
        lessons: {
          include: {
            teacher: true,
            class: true,
            subject: true,
            classroom: true,
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
        periods: {
          orderBy: { startDate: 'asc' },
        },
        lessons: {
          include: {
            teacher: true,
            class: true,
            subject: true,
            classroom: true,
          },
        },
      },
    });
  }

  // Delete schedule version (cascades to periods and lessons)
  static async deleteScheduleVersion(id: string): Promise<void> {
    await prisma.scheduleVersion.delete({
      where: { id },
    });
  }

  // Get all schedule versions
  static async getScheduleVersions(filters: ScheduleVersionFilters = {}): Promise<ScheduleVersion[]> {
    const where: Record<string, any> = {};

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters.name) {
      where.name = {
        contains: filters.name,
        mode: 'insensitive',
      };
    }

    return await prisma.scheduleVersion.findMany({
      where,
      include: {
        periods: {
          orderBy: { startDate: 'asc' },
        },
        lessons: {
          include: {
            teacher: true,
            class: true,
            subject: true,
            classroom: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Activate a schedule version (deactivates all others)
  static async activateScheduleVersion(id: string): Promise<ScheduleVersion> {
    return await prisma.$transaction(async (tx) => {
      // Deactivate all other versions
      await tx.scheduleVersion.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });

      // Activate the specified version
      return await tx.scheduleVersion.update({
        where: { id },
        data: { isActive: true },
        include: {
          periods: {
            orderBy: { startDate: 'asc' },
          },
          lessons: {
            include: {
              teacher: true,
              class: true,
              subject: true,
              classroom: true,
            },
          },
        },
      });
    });
  }

  // Get current active schedule version
  static async getCurrentScheduleVersion(): Promise<ScheduleVersion | null> {
    return await prisma.scheduleVersion.findFirst({
      where: { isActive: true },
      include: {
        periods: {
          orderBy: { startDate: 'asc' },
        },
        lessons: {
          include: {
            teacher: true,
            class: true,
            subject: true,
            classroom: true,
          },
        },
      },
    });
  }

  // Create a new schedule period
  static async createSchedulePeriod(data: CreateSchedulePeriodData): Promise<SchedulePeriod> {
    return await prisma.schedulePeriod.create({
      data,
      include: {
        scheduleVersion: {
          include: {
            periods: true,
            lessons: true,
          },
        },
      },
    });
  }

  // Get schedule period by ID
  static async getSchedulePeriodById(id: string): Promise<SchedulePeriod | null> {
    return await prisma.schedulePeriod.findUnique({
      where: { id },
      include: {
        scheduleVersion: {
          include: {
            periods: true,
            lessons: {
              include: {
                teacher: true,
                class: true,
                subject: true,
                classroom: true,
              },
            },
          },
        },
      },
    });
  }

  // Update schedule period
  static async updateSchedulePeriod(data: UpdateSchedulePeriodData): Promise<SchedulePeriod> {
    const { id, ...updateData } = data;
    return await prisma.schedulePeriod.update({
      where: { id },
      data: updateData,
      include: {
        scheduleVersion: {
          include: {
            periods: true,
            lessons: true,
          },
        },
      },
    });
  }

  // Delete schedule period
  static async deleteSchedulePeriod(id: string): Promise<void> {
    await prisma.schedulePeriod.delete({
      where: { id },
    });
  }

  // Get schedule periods with filters
  static async getSchedulePeriods(filters: SchedulePeriodFilters = {}): Promise<SchedulePeriod[]> {
    const where: Record<string, any> = {};

    if (filters.scheduleVersionId) {
      where.scheduleVersionId = filters.scheduleVersionId;
    }

    if (filters.isCurrent !== undefined) {
      where.isCurrent = filters.isCurrent;
    }

    if (filters.startDate) {
      where.startDate = {
        gte: filters.startDate,
      };
    }

    if (filters.endDate) {
      where.endDate = {
        lte: filters.endDate,
      };
    }

    if (filters.date) {
      where.AND = [
        { startDate: { lte: filters.date } },
        { endDate: { gte: filters.date } },
      ];
    }

    return await prisma.schedulePeriod.findMany({
      where,
      include: {
        scheduleVersion: {
          include: {
            periods: true,
            lessons: {
              include: {
                teacher: true,
                class: true,
                subject: true,
                classroom: true,
              },
            },
          },
        },
      },
      orderBy: { startDate: 'asc' },
    });
  }

  // Get current schedule period for a specific date
  static async getCurrentSchedulePeriod(date: Date = new Date()): Promise<SchedulePeriod | null> {
    return await prisma.schedulePeriod.findFirst({
      where: {
        AND: [
          { startDate: { lte: date } },
          { endDate: { gte: date } },
          { isCurrent: true },
        ],
      },
      include: {
        scheduleVersion: {
          include: {
            periods: true,
            lessons: {
              include: {
                teacher: true,
                class: true,
                subject: true,
                classroom: true,
              },
            },
          },
        },
      },
    });
  }

  // Set current schedule period (unsets all others)
  static async setCurrentSchedulePeriod(id: string): Promise<SchedulePeriod> {
    return await prisma.$transaction(async (tx) => {
      // Unset all other current periods
      await tx.schedulePeriod.updateMany({
        where: { isCurrent: true },
        data: { isCurrent: false },
      });

      // Set the specified period as current
      return await tx.schedulePeriod.update({
        where: { id },
        data: { isCurrent: true },
        include: {
          scheduleVersion: {
            include: {
              periods: true,
              lessons: {
                include: {
                  teacher: true,
                  class: true,
                  subject: true,
                  classroom: true,
                },
              },
            },
          },
        },
      });
    });
  }

  // Get schedule version for a specific date
  static async getScheduleVersionForDate(date: Date = new Date()): Promise<ScheduleVersion | null> {
    const period = await this.getCurrentSchedulePeriod(date);
    return period?.scheduleVersion || null;
  }

  // Copy lessons from one schedule version to another
  static async copyLessonsBetweenVersions(
    fromVersionId: string,
    toVersionId: string
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
            startTime: lesson.startTime,
            endTime: lesson.endTime,
            dayOfWeek: lesson.dayOfWeek,
            weekNumber: lesson.weekNumber,
            teacherId: lesson.teacherId,
            classId: lesson.classId,
            subjectId: lesson.subjectId,
            classroomId: lesson.classroomId,
            scheduleVersionId: toVersionId,
          },
        });
      }
    });
  }
}

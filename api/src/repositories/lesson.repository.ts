import { PrismaClient, Lesson } from '@prisma/client';
import { BaseRepository, RepositoryFilters, PaginatedResult } from './base.repository';
import type { LessonFilters } from '@shared/types';
import type { LessonWithIncludes } from '../types/lesson';

export class LessonRepository extends BaseRepository<Lesson> {
  async findById(id: number): Promise<Lesson | null> {
    return this.prisma.lesson.findUnique({
      where: { id },
      include: {
        teacher: {
          include: {
            user: true,
            subjects: {
              include: {
                subject: true
              }
            }
          }
        },
        class: true,
        subject: true,
        classroom: true,
        lessonSchedule: true,
        scheduleVersion: true
      }
    });
  }

  async create(data: Partial<Lesson>): Promise<Lesson> {
    return this.prisma.lesson.create({
      data: data as any,
      include: {
        teacher: {
          include: {
            user: true,
            subjects: {
              include: {
                subject: true
              }
            }
          }
        },
        class: true,
        subject: true,
        classroom: true,
        lessonSchedule: true,
        scheduleVersion: true
      }
    });
  }

  async update(id: number, data: Partial<Lesson>): Promise<Lesson> {
    return this.prisma.lesson.update({
      where: { id },
      data: data as any,
      include: {
        teacher: {
          include: {
            user: true,
            subjects: {
              include: {
                subject: true
              }
            }
          }
        },
        class: true,
        subject: true,
        classroom: true,
        lessonSchedule: true,
        scheduleVersion: true
      }
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.lesson.delete({
      where: { id }
    });
  }

  async findMany(filters?: LessonFilters & RepositoryFilters): Promise<LessonWithIncludes[]> {
    const where: any = {};

    if (filters?.idTeacher) {
      where.idTeacher = filters.idTeacher;
    }
    if (filters?.idClass) {
      where.idClass = filters.idClass;
    }
    if (filters?.idSubject) {
      where.idSubject = filters.idSubject;
    }
    if (filters?.dayOfWeek !== undefined) {
      where.dayOfWeek = filters.dayOfWeek;
    }
    if (filters?.idScheduleVersion) {
      where.idScheduleVersion = filters.idScheduleVersion;
    }

    const lessons = await this.prisma.lesson.findMany({
      where,
      include: {
        teacher: {
          include: {
            user: true,
            subjects: {
              include: {
                subject: true
              }
            }
          }
        },
        class: true,
        subject: true,
        classroom: true,
        lessonSchedule: true,
        scheduleVersion: true
      },
      orderBy: {
        dayOfWeek: 'asc'
      }
    });

    return lessons;
  }

  async findPaginated(filters?: LessonFilters & RepositoryFilters): Promise<PaginatedResult<LessonWithIncludes>> {
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters?.idTeacher) {
      where.idTeacher = filters.idTeacher;
    }
    if (filters?.idClass) {
      where.idClass = filters.idClass;
    }
    if (filters?.idSubject) {
      where.idSubject = filters.idSubject;
    }
    if (filters?.dayOfWeek !== undefined) {
      where.dayOfWeek = filters.dayOfWeek;
    }
    if (filters?.idScheduleVersion) {
      where.idScheduleVersion = filters.idScheduleVersion;
    }

    const [lessons, total] = await Promise.all([
      this.prisma.lesson.findMany({
        where,
        include: {
          teacher: {
            include: {
              user: true,
              subjects: {
                include: {
                  subject: true
                }
              }
            }
          },
          class: true,
          subject: true,
          classroom: true,
          lessonSchedule: true,
          scheduleVersion: true
        },
        orderBy: {
          dayOfWeek: 'asc'
        },
        skip,
        take: limit
      }),
      this.prisma.lesson.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: lessons,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  }

  async findByTeacherAndDate(teacherId: number, date: Date): Promise<LessonWithIncludes[]> {
    const dayOfWeek = date.getDay();
    
    return this.prisma.lesson.findMany({
      where: {
        idTeacher: teacherId,
        dayOfWeek
      },
      include: {
        teacher: {
          include: {
            user: true,
            subjects: {
              include: {
                subject: true
              }
            }
          }
        },
        class: true,
        subject: true,
        classroom: true,
        lessonSchedule: true,
        scheduleVersion: true
      },
      orderBy: {
        lessonSchedule: {
          lessonNumber: 'asc'
        }
      }
    });
  }

  async findByClassAndDate(classId: number, date: Date): Promise<LessonWithIncludes[]> {
    const dayOfWeek = date.getDay();
    
    return this.prisma.lesson.findMany({
      where: {
        idClass: classId,
        dayOfWeek
      },
      include: {
        teacher: {
          include: {
            user: true,
            subjects: {
              include: {
                subject: true
              }
            }
          }
        },
        class: true,
        subject: true,
        classroom: true,
        lessonSchedule: true,
        scheduleVersion: true
      },
      orderBy: {
        lessonSchedule: {
          lessonNumber: 'asc'
        }
      }
    });
  }
}

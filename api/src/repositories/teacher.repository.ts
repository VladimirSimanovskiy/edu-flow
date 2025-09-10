import { PrismaClient, Teacher } from '@prisma/client';
import { BaseRepository, RepositoryFilters, PaginatedResult } from './base.repository';
import type { TeacherFilters } from '@shared/types';

export class TeacherRepository extends BaseRepository<Teacher> {
  async findById(id: number): Promise<Teacher | null> {
    return this.prisma.teacher.findUnique({
      where: { id },
      include: {
        user: true,
        subjects: {
          include: {
            subject: true
          }
        },
        assignedClassroom: true,
        classLeaderships: true,
        lessons: {
          include: {
            class: true,
            subject: true,
            classroom: true,
            lessonSchedule: true
          }
        }
      }
    });
  }

  async create(data: Partial<Teacher>): Promise<Teacher> {
    return this.prisma.teacher.create({
      data: data as any,
      include: {
        user: true,
        subjects: {
          include: {
            subject: true
          }
        },
        assignedClassroom: true,
        classLeaderships: true
      }
    });
  }

  async update(id: number, data: Partial<Teacher>): Promise<Teacher> {
    return this.prisma.teacher.update({
      where: { id },
      data: data as any,
      include: {
        user: true,
        subjects: {
          include: {
            subject: true
          }
        },
        assignedClassroom: true,
        classLeaderships: true
      }
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.teacher.delete({
      where: { id }
    });
  }

  async findMany(filters?: TeacherFilters & RepositoryFilters): Promise<Teacher[]> {
    const where: any = {};

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }
    if (filters?.idAssignedClassroom) {
      where.idAssignedClassroom = filters.idAssignedClassroom;
    }
    if (filters?.search) {
      where.OR = [
        { firstName: { contains: filters.search, mode: 'insensitive' } },
        { lastName: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } }
      ];
    }

    return this.prisma.teacher.findMany({
      where,
      include: {
        user: true,
        subjects: {
          include: {
            subject: true
          }
        },
        assignedClassroom: true,
        classLeaderships: true
      },
      orderBy: [
        { lastName: 'asc' },
        { firstName: 'asc' }
      ]
    });
  }

  async findPaginated(filters?: TeacherFilters & RepositoryFilters): Promise<PaginatedResult<Teacher>> {
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }
    if (filters?.idAssignedClassroom) {
      where.idAssignedClassroom = filters.idAssignedClassroom;
    }
    if (filters?.search) {
      where.OR = [
        { firstName: { contains: filters.search, mode: 'insensitive' } },
        { lastName: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } }
      ];
    }

    const [teachers, total] = await Promise.all([
      this.prisma.teacher.findMany({
        where,
        include: {
          user: true,
          subjects: {
            include: {
              subject: true
            }
          },
          assignedClassroom: true,
          classLeaderships: true
        },
        orderBy: [
          { lastName: 'asc' },
          { firstName: 'asc' }
        ],
        skip,
        take: limit
      }),
      this.prisma.teacher.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: teachers,
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

  async findBySubject(subjectId: number): Promise<Teacher[]> {
    return this.prisma.teacher.findMany({
      where: {
        subjects: {
          some: {
            idSubject: subjectId
          }
        },
        isActive: true
      },
      include: {
        user: true,
        subjects: {
          include: {
            subject: true
          }
        },
        assignedClassroom: true
      },
      orderBy: [
        { lastName: 'asc' },
        { firstName: 'asc' }
      ]
    });
  }

  async findActive(): Promise<Teacher[]> {
    return this.prisma.teacher.findMany({
      where: { isActive: true },
      include: {
        user: true,
        subjects: {
          include: {
            subject: true
          }
        },
        assignedClassroom: true,
        classLeaderships: true
      },
      orderBy: [
        { lastName: 'asc' },
        { firstName: 'asc' }
      ]
    });
  }
}

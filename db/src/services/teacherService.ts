import { prisma } from '../index';
import { Teacher, Prisma } from '../../generated/prisma';

export interface CreateTeacherData {
  name: string;
  email: string;
  subjects: string[];
  userId: string;
}

export interface UpdateTeacherData extends Partial<CreateTeacherData> {
  id: string;
}

export class TeacherService {
  // Create a new teacher
  static async createTeacher(data: CreateTeacherData): Promise<Teacher> {
    return await prisma.teacher.create({
      data,
      include: {
        user: true,
        lessons: {
          include: {
            class: true,
            subject: true,
            classroom: true,
          },
        },
      },
    });
  }

  // Get teacher by ID
  static async getTeacherById(id: string): Promise<Teacher | null> {
    return await prisma.teacher.findUnique({
      where: { id },
      include: {
        user: true,
        lessons: {
          include: {
            class: true,
            subject: true,
            classroom: true,
          },
        },
      },
    });
  }

  // Get teacher by email
  static async getTeacherByEmail(email: string): Promise<Teacher | null> {
    return await prisma.teacher.findUnique({
      where: { email },
      include: {
        user: true,
        lessons: {
          include: {
            class: true,
            subject: true,
            classroom: true,
          },
        },
      },
    });
  }

  // Get teacher by user ID
  static async getTeacherByUserId(userId: string): Promise<Teacher | null> {
    return await prisma.teacher.findUnique({
      where: { userId },
      include: {
        user: true,
        lessons: {
          include: {
            class: true,
            subject: true,
            classroom: true,
          },
        },
      },
    });
  }

  // Update teacher
  static async updateTeacher(data: UpdateTeacherData): Promise<Teacher> {
    const { id, ...updateData } = data;
    return await prisma.teacher.update({
      where: { id },
      data: updateData,
      include: {
        user: true,
        lessons: {
          include: {
            class: true,
            subject: true,
            classroom: true,
          },
        },
      },
    });
  }

  // Delete teacher
  static async deleteTeacher(id: string): Promise<void> {
    await prisma.teacher.delete({
      where: { id },
    });
  }

  // Get all teachers
  static async getAllTeachers(): Promise<Teacher[]> {
    return await prisma.teacher.findMany({
      include: {
        user: true,
        lessons: {
          include: {
            class: true,
            subject: true,
            classroom: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  // Get teachers by subject
  static async getTeachersBySubject(subject: string): Promise<Teacher[]> {
    return await prisma.teacher.findMany({
      where: {
        subjects: {
          has: subject,
        },
      },
      include: {
        user: true,
        lessons: {
          include: {
            class: true,
            subject: true,
            classroom: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  // Search teachers
  static async searchTeachers(query: string): Promise<Teacher[]> {
    return await prisma.teacher.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            subjects: {
              hasSome: [query],
            },
          },
        ],
      },
      include: {
        user: true,
        lessons: {
          include: {
            class: true,
            subject: true,
            classroom: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }
}

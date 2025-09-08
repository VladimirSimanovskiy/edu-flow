import { prisma } from '../index';
import { Teacher, Prisma } from '../../generated/prisma';

export interface CreateTeacherData {
  firstName: string;
  lastName: string;
  middleName?: string;
  email?: string;
  phone?: string;
  idUser?: number;
  idAssignedClassroom?: number;
}

export interface UpdateTeacherData extends Partial<CreateTeacherData> {
  id: number;
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
  static async getTeacherById(id: number): Promise<Teacher | null> {
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
    return await prisma.teacher.findFirst({
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
  static async getTeacherByUserId(idUser: number): Promise<Teacher | null> {
    return await prisma.teacher.findFirst({
      where: { idUser },
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
  static async deleteTeacher(id: number): Promise<void> {
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
        lastName: 'asc',
      },
    });
  }

  // Get teachers by subject
  static async getTeachersBySubject(subjectId: number): Promise<Teacher[]> {
    return await prisma.teacher.findMany({
      where: {
        lessons: {
          some: {
            idSubject: subjectId,
          },
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
        lastName: 'asc',
      },
    });
  }

  // Search teachers
  static async searchTeachers(query: string): Promise<Teacher[]> {
    return await prisma.teacher.findMany({
      where: {
        OR: [
          {
            firstName: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            lastName: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            middleName: {
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
        lastName: 'asc',
      },
    });
  }
}

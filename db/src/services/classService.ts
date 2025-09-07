import { prisma } from '../index';
import { Class, Prisma } from '../../generated/prisma';

export interface CreateClassData {
  name: string;
  grade: number;
  students: number;
}

export interface UpdateClassData extends Partial<CreateClassData> {
  id: string;
}

export class ClassService {
  // Create a new class
  static async createClass(data: CreateClassData): Promise<Class> {
    return await prisma.class.create({
      data,
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
          },
        },
      },
    });
  }

  // Get class by ID
  static async getClassById(id: string): Promise<Class | null> {
    return await prisma.class.findUnique({
      where: { id },
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
          },
        },
      },
    });
  }

  // Get class by name
  static async getClassByName(name: string): Promise<Class | null> {
    return await prisma.class.findUnique({
      where: { name },
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
          },
        },
      },
    });
  }

  // Update class
  static async updateClass(data: UpdateClassData): Promise<Class> {
    const { id, ...updateData } = data;
    return await prisma.class.update({
      where: { id },
      data: updateData,
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
          },
        },
      },
    });
  }

  // Delete class
  static async deleteClass(id: string): Promise<void> {
    await prisma.class.delete({
      where: { id },
    });
  }

  // Get all classes
  static async getAllClasses(): Promise<Class[]> {
    return await prisma.class.findMany({
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
          },
        },
      },
      orderBy: [
        { grade: 'asc' },
        { name: 'asc' },
      ],
    });
  }

  // Get classes by grade
  static async getClassesByGrade(grade: number): Promise<Class[]> {
    return await prisma.class.findMany({
      where: { grade },
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
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  // Search classes
  static async searchClasses(query: string): Promise<Class[]> {
    return await prisma.class.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
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
            subject: true,
            classroom: true,
          },
        },
      },
      orderBy: [
        { grade: 'asc' },
        { name: 'asc' },
      ],
    });
  }

  // Get class statistics
  static async getClassStatistics(classId: string) {
    const classData = await prisma.class.findUnique({
      where: { id: classId },
      include: {
        lessons: {
          include: {
            subject: true,
            teacher: true,
          },
        },
      },
    });

    if (!classData) {
      return null;
    }

    const totalLessons = classData.lessons.length;
    const subjects = [...new Set(classData.lessons.map(lesson => lesson.subject.name))];
    const teachers = [...new Set(classData.lessons.map(lesson => lesson.teacher.name))];

    return {
      class: classData,
      statistics: {
        totalLessons,
        subjectsCount: subjects.length,
        teachersCount: teachers.length,
        subjects,
        teachers,
      },
    };
  }
}

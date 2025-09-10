import { TeacherRepository } from '../repositories/teacher.repository';
import { BaseService } from './base.service';
import { Teacher } from '@prisma/client';
import type { 
  TeacherFilters, 
  CreateTeacherRequest, 
  UpdateTeacherRequest,
  PaginatedResult 
} from '@shared/types';
import type { TeacherWithIncludes } from '../types/teacher';
import type { TeacherWithDetails } from '@shared/types';

export class TeacherService extends BaseService<Teacher> {
  constructor(private teacherRepository: TeacherRepository) {
    super(teacherRepository);
  }

  async createTeacher(data: CreateTeacherRequest): Promise<Teacher> {
    // Validate email uniqueness if provided
    if (data.email) {
      const existingTeacher = await this.teacherRepository['prisma'].teacher.findFirst({
        where: { email: data.email }
      });

      if (existingTeacher) {
        throw new Error('Teacher with this email already exists');
      }
    }

    // Validate user exists if idUser is provided
    if (data.idUser) {
      const user = await this.teacherRepository['prisma'].user.findUnique({
        where: { id: data.idUser }
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Check if user already has a teacher profile
      const existingTeacher = await this.teacherRepository['prisma'].teacher.findUnique({
        where: { idUser: data.idUser }
      });

      if (existingTeacher) {
        throw new Error('User already has a teacher profile');
      }
    }

    return this.teacherRepository.create(data);
  }

  async updateTeacher(id: number, data: UpdateTeacherRequest): Promise<Teacher> {
    const existingTeacher = await this.teacherRepository.findById(id);
    if (!existingTeacher) {
      throw new Error('Teacher not found');
    }

    // Validate email uniqueness if being changed
    if (data.email && data.email !== existingTeacher.email) {
      const emailExists = await this.teacherRepository['prisma'].teacher.findFirst({
        where: { 
          email: data.email,
          id: { not: id }
        }
      });

      if (emailExists) {
        throw new Error('Teacher with this email already exists');
      }
    }

    return this.teacherRepository.update(id, data);
  }

  async getTeachersWithDetails(filters?: TeacherFilters): Promise<TeacherWithDetails[]> {
    const teachers = await this.teacherRepository.findMany(filters);
    return teachers.map(teacher => this.transformToTeacherWithDetails(teacher));
  }

  async getPaginatedTeachers(filters?: TeacherFilters & { page?: number; limit?: number }): Promise<PaginatedResult<TeacherWithDetails>> {
    const result = await this.teacherRepository.findPaginated(filters);
    
    return {
      ...result,
      data: result.data.map(teacher => this.transformToTeacherWithDetails(teacher))
    };
  }

  async getTeachersBySubject(subjectId: number): Promise<TeacherWithDetails[]> {
    const teachers = await this.teacherRepository.findBySubject(subjectId);
    return teachers.map(teacher => this.transformToTeacherWithDetails(teacher));
  }

  async getActiveTeachers(): Promise<TeacherWithDetails[]> {
    const teachers = await this.teacherRepository.findActive();
    return teachers.map(teacher => this.transformToTeacherWithDetails(teacher));
  }

  async assignSubjectToTeacher(teacherId: number, subjectId: number): Promise<void> {
    const teacher = await this.teacherRepository.findById(teacherId);
    if (!teacher) {
      throw new Error('Teacher not found');
    }

    const subject = await this.teacherRepository['prisma'].subject.findUnique({
      where: { id: subjectId }
    });

    if (!subject) {
      throw new Error('Subject not found');
    }

    // Check if assignment already exists
    const existingAssignment = await this.teacherRepository['prisma'].teacherSubject.findUnique({
      where: {
        idTeacher_idSubject: {
          idTeacher: teacherId,
          idSubject: subjectId
        }
      }
    });

    if (existingAssignment) {
      throw new Error('Teacher is already assigned to this subject');
    }

    await this.teacherRepository['prisma'].teacherSubject.create({
      data: {
        idTeacher: teacherId,
        idSubject: subjectId
      }
    });
  }

  async removeSubjectFromTeacher(teacherId: number, subjectId: number): Promise<void> {
    const assignment = await this.teacherRepository['prisma'].teacherSubject.findUnique({
      where: {
        idTeacher_idSubject: {
          idTeacher: teacherId,
          idSubject: subjectId
        }
      }
    });

    if (!assignment) {
      throw new Error('Subject assignment not found');
    }

    await this.teacherRepository['prisma'].teacherSubject.delete({
      where: {
        idTeacher_idSubject: {
          idTeacher: teacherId,
          idSubject: subjectId
        }
      }
    });
  }

  private transformToTeacherWithDetails(teacher: TeacherWithIncludes): TeacherWithDetails {
    const fullName = `${teacher.lastName} ${teacher.firstName}${teacher.middleName ? ` ${teacher.middleName}` : ''}`;
    const subjectNames = teacher.subjects.map(ts => ts.subject.name);

    return {
      // Base teacher fields
      id: teacher.id,
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      middleName: teacher.middleName,
      email: teacher.email,
      phone: teacher.phone,
      isActive: teacher.isActive,
      createdAt: teacher.createdAt,
      updatedAt: teacher.updatedAt,
      idAssignedClassroom: teacher.idAssignedClassroom,
      idUser: teacher.idUser,
      
      // Computed fields
      fullName,
      subjectNames,
      assignedClassroomNumber: teacher.assignedClassroom?.number
    };
  }
}

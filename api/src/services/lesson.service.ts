import { LessonRepository } from '../repositories/lesson.repository';
import { BaseService } from './base.service';
import { Lesson } from '@prisma/client';
import type { 
  LessonFilters, 
  CreateLessonRequest, 
  UpdateLessonRequest,
  LessonWithDetails,
  PaginatedResult 
} from '@shared/types';

export class LessonService extends BaseService<Lesson> {
  constructor(private lessonRepository: LessonRepository) {
    super(lessonRepository);
  }

  async createLesson(data: CreateLessonRequest): Promise<Lesson> {
    // Validate that teacher exists and is active
    const teacher = await this.lessonRepository['prisma'].teacher.findUnique({
      where: { id: data.idTeacher },
      include: { subjects: true }
    });

    if (!teacher || !teacher.isActive) {
      throw new Error('Teacher not found or inactive');
    }

    // Validate that teacher can teach this subject
    const canTeachSubject = teacher.subjects.some(
      ts => ts.idSubject === data.idSubject
    );

    if (!canTeachSubject) {
      throw new Error('Teacher cannot teach this subject');
    }

    // Check for conflicts
    await this.checkConflicts(data);

    return this.lessonRepository.create(data);
  }

  async updateLesson(id: number, data: UpdateLessonRequest): Promise<Lesson> {
    const existingLesson = await this.lessonRepository.findById(id);
    if (!existingLesson) {
      throw new Error('Lesson not found');
    }

    // If teacher or subject is being changed, validate
    if (data.idTeacher || data.idSubject) {
      const teacherId = data.idTeacher || existingLesson.idTeacher;
      const subjectId = data.idSubject || existingLesson.idSubject;

      const teacher = await this.lessonRepository['prisma'].teacher.findUnique({
        where: { id: teacherId },
        include: { subjects: true }
      });

      if (!teacher || !teacher.isActive) {
        throw new Error('Teacher not found or inactive');
      }

      const canTeachSubject = teacher.subjects.some(
        ts => ts.idSubject === subjectId
      );

      if (!canTeachSubject) {
        throw new Error('Teacher cannot teach this subject');
      }
    }

    // Check for conflicts if time/classroom is being changed
    if (data.dayOfWeek || data.idClassroom || data.idLessonSchedule) {
      const conflictData = {
        ...existingLesson,
        ...data
      };
      await this.checkConflicts(conflictData, id);
    }

    return this.lessonRepository.update(id, data);
  }

  async getLessonsWithDetails(filters?: LessonFilters): Promise<LessonWithDetails[]> {
    const lessons = await this.lessonRepository.findMany(filters);
    
    return lessons.map(lesson => this.transformToLessonWithDetails(lesson));
  }

  async getPaginatedLessons(filters?: LessonFilters & { page?: number; limit?: number }): Promise<PaginatedResult<LessonWithDetails>> {
    const result = await this.lessonRepository.findPaginated(filters);
    
    return {
      ...result,
      data: result.data.map(lesson => this.transformToLessonWithDetails(lesson))
    };
  }

  async getTeacherSchedule(teacherId: number, date: Date): Promise<LessonWithDetails[]> {
    const lessons = await this.lessonRepository.findByTeacherAndDate(teacherId, date);
    return lessons.map(lesson => this.transformToLessonWithDetails(lesson));
  }

  async getClassSchedule(classId: number, date: Date): Promise<LessonWithDetails[]> {
    const lessons = await this.lessonRepository.findByClassAndDate(classId, date);
    return lessons.map(lesson => this.transformToLessonWithDetails(lesson));
  }

  private async checkConflicts(data: CreateLessonRequest | any, excludeId?: number): Promise<void> {
    const where: any = {
      dayOfWeek: data.dayOfWeek,
      idLessonSchedule: data.idLessonSchedule,
      idScheduleVersion: data.idScheduleVersion
    };

    if (excludeId) {
      where.id = { not: excludeId };
    }

    // Check teacher conflicts
    const teacherConflicts = await this.lessonRepository['prisma'].lesson.findMany({
      where: {
        ...where,
        idTeacher: data.idTeacher
      }
    });

    if (teacherConflicts.length > 0) {
      throw new Error('Teacher has a conflict at this time');
    }

    // Check class conflicts
    const classConflicts = await this.lessonRepository['prisma'].lesson.findMany({
      where: {
        ...where,
        idClass: data.idClass
      }
    });

    if (classConflicts.length > 0) {
      throw new Error('Class has a conflict at this time');
    }

    // Check classroom conflicts
    const classroomConflicts = await this.lessonRepository['prisma'].lesson.findMany({
      where: {
        ...where,
        idClassroom: data.idClassroom
      }
    });

    if (classroomConflicts.length > 0) {
      throw new Error('Classroom has a conflict at this time');
    }
  }

  private transformToLessonWithDetails(lesson: Lesson): LessonWithDetails {
    const startTime = lesson.lessonSchedule.timeBegin.toTimeString().slice(0, 5);
    const endTime = lesson.lessonSchedule.timeEnd.toTimeString().slice(0, 5);

    return {
      ...lesson,
      subjectName: lesson.subject.name,
      teacherName: `${lesson.teacher.lastName} ${lesson.teacher.firstName}`,
      className: `${lesson.class.grade}${lesson.class.letter}`,
      classroomNumber: lesson.classroom.number,
      startTime,
      endTime,
      lessonNumber: lesson.lessonSchedule.lessonNumber
    };
  }
}

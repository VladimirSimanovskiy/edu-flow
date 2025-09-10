import type { Lesson, Teacher, Class, Subject, Classroom, ScheduleVersion, User } from './database';

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  error: {
    message: string;
    code: string;
    details?: any;
  };
}

// Request types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT';
}

export interface CreateLessonRequest {
  dayOfWeek: number;
  idTeacher: number;
  idClass: number;
  idSubject: number;
  idClassroom: number;
  idLessonSchedule: number;
  idScheduleVersion: number;
}

export interface UpdateLessonRequest extends Partial<CreateLessonRequest> {
  id: number;
}

export interface CreateScheduleVersionRequest {
  dateBegin: string;
  dateEnd?: string;
  description?: string;
}

export interface UpdateScheduleVersionRequest extends Partial<CreateScheduleVersionRequest> {
  id: number;
}

export interface CreateTeacherRequest {
  firstName: string;
  lastName: string;
  middleName?: string;
  email?: string;
  phone?: string;
  idUser?: number;
  idAssignedClassroom?: number;
}

export interface UpdateTeacherRequest extends Partial<CreateTeacherRequest> {
  id: number;
}

export interface CreateClassRequest {
  grade: number;
  letter: string;
  idClassLeaderTeacher?: number;
}

export interface UpdateClassRequest extends Partial<CreateClassRequest> {
  id: number;
}

export interface CreateSubjectRequest {
  name: string;
  code: string;
  description?: string;
}

export interface UpdateSubjectRequest extends Partial<CreateSubjectRequest> {
  id: number;
}

export interface CreateClassroomRequest {
  number: number;
  floor: number;
}

export interface UpdateClassroomRequest extends Partial<CreateClassroomRequest> {
  id: number;
}

// Filter types
export interface LessonFilters {
  idTeacher?: number;
  idClass?: number;
  idSubject?: number;
  dayOfWeek?: number;
  idScheduleVersion?: number;
  startDate?: string;
  endDate?: string;
  date?: string;
}

export interface TeacherFilters {
  isActive?: boolean;
  idAssignedClassroom?: number;
  search?: string; // Search by name or email
}

export interface ClassFilters {
  grade?: number;
  idClassLeaderTeacher?: number;
  search?: string; // Search by grade or letter
}

export interface SubjectFilters {
  search?: string; // Search by name or code
}

export interface ClassroomFilters {
  floor?: number;
  number?: number;
}

export interface ScheduleVersionFilters {
  dateBegin?: string;
  dateEnd?: string;
  description?: string;
}

// Pagination types
export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Extended types with computed fields for API responses
export interface LessonWithDetails {
  // Base lesson fields
  id: number;
  dayOfWeek: number;
  createdAt: Date;
  updatedAt: Date;
  idTeacher: number;
  idClass: number;
  idSubject: number;
  idClassroom: number;
  idLessonSchedule: number;
  idScheduleVersion: number;
  
  // Computed fields
  subjectName: string;
  teacherName: string;
  className: string;
  classroomNumber: number;
  startTime: string;
  endTime: string;
  lessonNumber: number;
}

export interface TeacherWithDetails {
  // Base teacher fields
  id: number;
  firstName: string;
  lastName: string;
  middleName: string | null;
  email: string | null;
  phone: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  idAssignedClassroom: number | null;
  idUser: number | null;
  
  // Computed fields
  fullName: string;
  subjectNames: string[];
  assignedClassroomNumber?: number;
}

export interface ClassWithDetails extends Class {
  name: string;
  classLeaderName?: string;
  studentCount: number;
}

export interface ScheduleVersionWithLessons extends ScheduleVersion {
  lessons: LessonWithDetails[];
}

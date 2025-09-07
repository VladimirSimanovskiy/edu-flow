// Shared types between frontend and backend
export interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT';
  createdAt: Date;
  updatedAt: Date;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  subjects: string[];
  userId: string;
  user: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface Class {
  id: string;
  name: string;
  grade: number;
  students: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subject {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Classroom {
  id: string;
  number: string;
  capacity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lesson {
  id: string;
  startTime: string;
  endTime: string;
  dayOfWeek: number;
  weekNumber?: number;
  teacherId: string;
  classId: string;
  subjectId: string;
  classroomId: string;
  teacher: Teacher;
  class: Class;
  subject: Subject;
  classroom: Classroom;
  createdAt: Date;
  updatedAt: Date;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  error: {
    message: string;
    stack?: string;
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
  startTime: string;
  endTime: string;
  dayOfWeek: number;
  weekNumber?: number;
  teacherId: string;
  classId: string;
  subjectId: string;
  classroomId: string;
}

export interface UpdateLessonRequest extends Partial<CreateLessonRequest> {
  id: string;
}

// Filter types
export interface LessonFilters {
  teacherId?: string;
  classId?: string;
  subjectId?: string;
  dayOfWeek?: number;
  weekNumber?: number;
  startDate?: string;
  endDate?: string;
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

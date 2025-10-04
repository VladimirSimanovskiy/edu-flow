/**
 * Типы для справочников
 */

export interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
  middleName?: string;
  email?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Classroom {
  id: number;
  number: number;
  floor: number;
  createdAt: string;
  updatedAt: string;
}

export interface Subject {
  id: number;
  name: string;
  code: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReferenceFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface ReferencePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ReferenceResponse<T> {
  data: T;
  success: boolean;
  message: string;
}

export interface ReferencePaginatedResponse<T> {
  data: T[];
  pagination: ReferencePagination;
  success: boolean;
  message: string;
}

// Типы для форм
export interface TeacherFormData {
  firstName: string;
  lastName: string;
  middleName?: string;
  email?: string;
  phone?: string;
  isActive: boolean;
}

export interface ClassroomFormData {
  number: number;
  floor: number;
}

export interface SubjectFormData {
  name: string;
  code: string;
  description?: string;
}

// Типы для CRUD операций
export type ReferenceEntity = Teacher | Classroom | Subject;
export type ReferenceFormData = TeacherFormData | ClassroomFormData | SubjectFormData;

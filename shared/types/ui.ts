import type { Lesson, Teacher, Class, LessonSchedule, ScheduleVersion, User } from './database';
import type { LessonWithDetails, TeacherWithDetails, ClassWithDetails } from './api';

// Type aliases for UI
export type LessonWithUI = LessonWithDetails;
export type TeacherWithUI = TeacherWithDetails;
export type ClassWithUI = ClassWithDetails;

export interface ScheduleCell {
  lessonNumber: number;
  class?: string; // для расписания учителей
  teacher?: string; // для расписания классов
  classroom?: string; // для расписания классов
  subject?: string;
  lesson?: LessonWithUI;
}

export interface ScheduleView {
  type: 'day' | 'week';
  date: Date;
}

export interface ScheduleFilters {
  idTeacher?: number;
  idClass?: number;
  idSubject?: number;
  dayOfWeek?: number;
  idScheduleVersion?: number;
  date?: string;
  startDate?: string;
  endDate?: string;
}

export interface LessonScheduleWithTimes extends LessonSchedule {
  startTime: string;
  endTime: string;
}

// Re-export from api.ts to maintain consistency
export type { ScheduleVersionWithLessons } from './api';

// Store types
export interface ScheduleState {
  currentView: ScheduleView;
  filters: ScheduleFilters;
  setView: (view: ScheduleView) => void;
  setFilters: (filters: Partial<ScheduleFilters>) => void;
  setDate: (date: Date) => void;
  setViewType: (type: 'day' | 'week') => void;
}

// Component props types
export interface ScheduleTableProps {
  lessons: LessonWithUI[];
  viewType: 'day' | 'week';
  date: Date;
  onLessonClick?: (lesson: LessonWithUI) => void;
}

export interface LessonCellProps {
  lesson?: LessonWithUI;
  lessonNumber: number;
  onClick?: () => void;
  className?: string;
}

export interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

export interface ViewToggleProps {
  value: 'day' | 'week';
  onChange: (value: 'day' | 'week') => void;
  className?: string;
}

// Form types
export interface LessonFormData {
  dayOfWeek: number;
  idTeacher: number;
  idClass: number;
  idSubject: number;
  idClassroom: number;
  idLessonSchedule: number;
  idScheduleVersion: number;
}

export interface TeacherFormData {
  firstName: string;
  lastName: string;
  middleName?: string;
  email?: string;
  phone?: string;
  idUser?: number;
  idAssignedClassroom?: number;
}

export interface ClassFormData {
  grade: number;
  letter: string;
  idClassLeaderTeacher?: number;
}

export interface SubjectFormData {
  name: string;
  code: string;
  description?: string;
}

export interface ClassroomFormData {
  number: number;
  floor: number;
}

// Hook return types
export interface UseScheduleReturn {
  lessons: LessonWithUI[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export interface UseAuthReturn {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

// Re-export constants from api.ts to avoid duplication
export type { DayOfWeek, LessonNumber } from './api';
export { DAYS_OF_WEEK, LESSON_NUMBERS } from './api';

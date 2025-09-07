export interface Lesson {
  id: string;
  subject: string;
  teacher: string;
  teacherId: string;
  class: string;
  classId: string;
  classroom: string;
  startTime: string;
  endTime: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  weekNumber?: number; // For weekly view
  lessonNumber: number; // 1-7 (номер урока)
}

export interface Teacher {
  id: string;
  name: string;
  fullName: string; // ФИО
  email: string;
  subjects: string[];
  department: string; // кафедра
}

export interface Class {
  id: string;
  name: string;
  grade: number;
  students: number;
}

export interface Department {
  id: string;
  name: string;
  teachers: Teacher[];
}

export interface ScheduleCell {
  lessonNumber: number;
  class?: string; // для расписания учителей
  teacher?: string; // для расписания классов
  classroom?: string; // для расписания классов
  subject?: string;
}

export interface ScheduleView {
  type: 'day' | 'week';
  date: Date;
}

export interface ScheduleFilters {
  teacherId?: string;
  classId?: string;
  subject?: string;
}

import type { Lesson as DatabaseLesson, Teacher as DatabaseTeacher, Class as DatabaseClass, LessonSchedule, ScheduleVersion } from './database';

export interface Lesson extends DatabaseLesson {
  // Computed fields for UI
  subjectName: string;
  teacherName: string;
  className: string;
  classroomNumber: number;
  startTime: string;
  endTime: string;
  lessonNumber: number;
}

export interface Teacher extends DatabaseTeacher {
  // Computed fields for UI
  fullName: string;
  subjectNames: string[];
}

export interface Class extends DatabaseClass {
  // Computed fields for UI
  name: string;
  classLeaderName?: string;
}

export interface ScheduleCell {
  lessonNumber: number;
  class?: string; // для расписания учителей
  teacher?: string; // для расписания классов
  classroom?: string; // для расписания классов
  subject?: string;
  lesson?: Lesson;
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

export interface ScheduleVersionWithLessons extends ScheduleVersion {
  lessons: Lesson[];
}

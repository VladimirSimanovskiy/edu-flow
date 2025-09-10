// Types for lesson with relations (internal API use)
export interface LessonWithIncludes {
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
  
  // Relations (only needed fields)
  teacher: {
    firstName: string;
    lastName: string;
  };
  class: {
    grade: number;
    letter: string;
  };
  subject: {
    name: string;
  };
  classroom: {
    number: number;
  };
  lessonSchedule: {
    timeBegin: Date;
    timeEnd: Date;
    lessonNumber: number;
  };
}

// Re-export shared types to avoid duplication
export type { LessonWithDetails } from '@shared/types';

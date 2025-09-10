// Types for lesson with relations
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

// Type for API responses
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

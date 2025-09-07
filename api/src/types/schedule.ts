export interface Lesson {
  id: string;
  subject: string;
  teacher: string;
  classroom: string;
  startTime: string;
  endTime: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  weekNumber?: number;
  teacherId: string;
  classId: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  subjects: string[];
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

export interface User {
  id: string;
  email: string;
  password: string;
  role: 'admin' | 'teacher' | 'student';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLessonRequest {
  subject: string;
  teacherId: string;
  classId: string;
  classroom: string;
  startTime: string;
  endTime: string;
  dayOfWeek: number;
  weekNumber?: number;
}

export interface UpdateLessonRequest extends Partial<CreateLessonRequest> {
  id: string;
}

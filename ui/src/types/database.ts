// Database types
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

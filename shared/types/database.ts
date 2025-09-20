// Database types - based on Prisma schema
export interface User {
  id: number;
  email: string;
  password: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT';
  createdAt: Date;
  updatedAt: Date;
  teacher?: Teacher;
  student?: Student;
}

export interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
  middleName?: string;
  email?: string;
  phone?: string;
  isActive: boolean;
  idUser?: number;
  idAssignedClassroom?: number;
  user?: User;
  subjects: TeacherSubject[];
  lessons: Lesson[];
  assignedClassroom?: Classroom;
  classLeaderships: Class[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TeacherSubject {
  id: number;
  idTeacher: number;
  idSubject: number;
  teacher: Teacher;
  subject: Subject;
  createdAt: Date;
}

export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  middleName?: string;
  email?: string;
  phone?: string;
  enrollmentDate: Date;
  dateBirth?: Date;
  isActive: boolean;
  idUser?: number;
  user?: User;
  classHistory: StudentClassHistory[];
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentClassHistory {
  id: number;
  idStudent: number;
  idClass: number;
  dateBegin: Date;
  dateEnd?: Date;
  student: Student;
  class: Class;
  createdAt: Date;
  updatedAt: Date;
}

export interface Class {
  id: number;
  grade: number;
  letter: string;
  idClassLeaderTeacher?: number;
  classLeader?: Teacher;
  lessons: Lesson[];
  studentHistory: StudentClassHistory[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Subject {
  id: number;
  name: string;
  code: string;
  description?: string;
  lessons: Lesson[];
  teacherSubjects: TeacherSubject[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Classroom {
  id: number;
  number: number;
  floor: number;
  lessons: Lesson[];
  assignedTeachers: Teacher[];
  createdAt: Date;
  updatedAt: Date;
}

export interface LessonSchedule {
  id: number;
  lessonNumber: number;
  timeBegin: Date;
  timeEnd: Date;
  lessons: Lesson[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ScheduleVersion {
  id: number;
  dateBegin: Date;
  dateEnd?: Date;
  description?: string;
  lessons: Lesson[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Substitution {
  id: number;
  date: Date;
  idLesson: number;
  idTeacher: number;
  idClassroom: number;
  lesson: Lesson;
  teacher: Teacher;
  classroom: Classroom;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lesson {
  id: number;
  dayOfWeek: number;
  idTeacher: number;
  idClass: number;
  idSubject: number;
  idClassroom: number;
  idLessonSchedule: number;
  idScheduleVersion: number;
  teacher: Teacher;
  class: Class;
  subject: Subject;
  classroom: Classroom;
  lessonSchedule: LessonSchedule;
  scheduleVersion: ScheduleVersion;
  substitutions?: Substitution[];
  createdAt: Date;
  updatedAt: Date;
}

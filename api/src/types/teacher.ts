// Types for teacher with relations
export interface TeacherWithIncludes {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string | null;
  email: string | null;
  phone: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  idAssignedClassroom: number | null;
  idUser: number | null;
  
  // Relations (only needed fields)
  user: {
    id: number;
    email: string;
  } | null;
  subjects: {
    subject: {
      name: string;
    };
  }[];
  assignedClassroom: {
    number: number;
  } | null;
  classLeaderships: {
    id: number;
    grade: number;
    letter: string;
  }[];
  lessons: {
    id: number;
    dayOfWeek: number;
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
      lessonNumber: number;
    };
  }[];
}

// Re-export shared types to avoid duplication
export type { TeacherWithDetails } from '@shared/types';

import { useMemo } from 'react';
import type { Lesson } from '../types/schedule';

export interface LessonData {
  teacherName?: string;
  classroomNumber?: string | number;
  className?: string;
  subjectName?: string;
}

export const useScheduleLogic = (lessons: Lesson[]) => {
  const getLessonForClass = useMemo(() => {
    return (classId: number, dayOfWeek: number, lessonNumber: number): LessonData | undefined => {
      const lesson = lessons.find(lesson => 
        lesson.idClass === classId &&
        lesson.dayOfWeek === dayOfWeek &&
        lesson.lessonNumber === lessonNumber
      );

      if (!lesson) return undefined;

      return {
        teacherName: lesson.teacherName,
        classroomNumber: lesson.classroomNumber,
        className: lesson.className,
        subjectName: lesson.subjectName
      };
    };
  }, [lessons]);

  const getLessonForTeacher = useMemo(() => {
    return (teacherId: number, dayOfWeek: number, lessonNumber: number): LessonData | undefined => {
      const lesson = lessons.find(lesson => 
        lesson.idTeacher === teacherId &&
        lesson.dayOfWeek === dayOfWeek &&
        lesson.lessonNumber === lessonNumber
      );

      if (!lesson) return undefined;

      return {
        teacherName: lesson.teacherName,
        classroomNumber: lesson.classroomNumber,
        className: lesson.className,
        subjectName: lesson.subjectName
      };
    };
  }, [lessons]);

  const getDayOfWeek = useMemo(() => {
    return (date: Date): number => {
      // Приводим день недели к стандарту базы данных (понедельник = 1, воскресенье = 7)
      return date.getDay() === 0 ? 7 : date.getDay();
    };
  }, []);

  return {
    getLessonForClass,
    getLessonForTeacher,
    getDayOfWeek
  };
};

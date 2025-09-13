import { useMemo } from 'react';
import type { Lesson } from '../../../types/schedule';

// Локальный тип для данных урока
export interface LessonData {
  primary?: string;
  secondary?: string[];
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

      const secondary: string[] = [];
      if (lesson.teacherName) secondary.push(lesson.teacherName);
      if (lesson.classroomNumber) secondary.push(`каб. ${lesson.classroomNumber}`);

      return {
        primary: lesson.subjectName,
        secondary
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

      const secondary: string[] = [];
      if (lesson.subjectName) secondary.push(lesson.subjectName);
      if (lesson.classroomNumber) secondary.push(`каб. ${lesson.classroomNumber}`);

      return {
        primary: lesson.className,
        secondary
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
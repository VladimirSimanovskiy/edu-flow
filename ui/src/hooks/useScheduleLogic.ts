import { useMemo } from 'react';
import type { Lesson } from '../types/schedule';

export interface LessonData {
  primary?: string; // Основная строка (предмет для классов, класс для учителей)
  secondary?: string[]; // Массив дополнительных строк (учитель и кабинет для классов, предмет и кабинет для учителей)
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
        primary: lesson.subjectName, // Для классов primary - это предмет
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
        primary: lesson.className, // Для учителей primary - это класс
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

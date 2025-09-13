import React from 'react';
import type { Teacher, Lesson } from '../../types/schedule';
import { WeekScheduleTable } from './base/week-schedule-table';
import { teacherToScheduleEntity, getLessonForTeacher } from './adapters/schedule-adapters';
import { useTeacherScheduleStore } from '../../store/teacherScheduleStore';
import type { LessonData } from './base/lesson-cell';

interface TeacherScheduleTableProps {
  teachers: Teacher[];
  lessons: Lesson[];
  weekStart: Date;
  className?: string;
  /**
   * Включить drag n scroll функциональность
   * @default true
   */
  enableDragScroll?: boolean;
}

export const TeacherScheduleTable: React.FC<TeacherScheduleTableProps> = ({
  teachers,
  lessons,
  weekStart,
  className,
  enableDragScroll = true,
}) => {
  const { highlight, setHighlightedClass, clearHighlight } = useTeacherScheduleStore();
  const scheduleEntities = teachers.map(teacherToScheduleEntity);

  // Обработчик клика по уроку в расписании учителей
  const handleLessonClick = (teacherId: number, day: Date, lessonNumber: number, lesson: LessonData) => {
    const className = lesson.primary;
    
    if (!className) return;

    // Находим класс по названию
    const classItem = lessons.find(l => 
      l.idTeacher === teacherId && 
      l.dayOfWeek === (day.getDay() === 0 ? 7 : day.getDay()) &&
      l.lessonNumber === lessonNumber
    );

    if (!classItem) return;

    const classId = classItem.idClass;
    const currentHighlightedClassId = highlight.highlightedClassId;

    // Если кликнули по тому же классу - снимаем подсветку
    if (currentHighlightedClassId === classId) {
      clearHighlight();
    } else {
      // Иначе подсвечиваем новый класс
      setHighlightedClass(classId, day);
    }
  };

  // Проверка, должен ли урок быть подсвечен
  const isLessonHighlighted = (teacherId: number, day: Date, lessonNumber: number, _lesson: LessonData): boolean => {
    if (!highlight.highlightedClassId) return false;

    // Находим урок и проверяем, что это тот же класс
    const lessonData = lessons.find(l => 
      l.idTeacher === teacherId && 
      l.dayOfWeek === (day.getDay() === 0 ? 7 : day.getDay()) &&
      l.lessonNumber === lessonNumber
    );

    return lessonData ? lessonData.idClass === highlight.highlightedClassId : false;
  };

  return (
    <WeekScheduleTable
      entities={scheduleEntities}
      lessons={lessons}
      weekStart={weekStart}
      className={className}
      getLessonForEntity={(teacherId, day, lessonNumber) => 
        getLessonForTeacher(lessons, teacherId, day, lessonNumber)
      }
      entityLabel="Учителя"
      onLessonClick={handleLessonClick}
      isLessonHighlighted={isLessonHighlighted}
      enableDragScroll={enableDragScroll}
    />
  );
};

import React from 'react';
import type { Class, Lesson } from '../../types/schedule';
import { WeekScheduleTable } from './base/week-schedule-table';
import { classToScheduleEntity, getLessonForClass } from './adapters/schedule-adapters';
import { useClassScheduleStore } from '../../store/classScheduleStore';
import { useScheduleFiltersContext } from './filters';
import type { LessonData } from './base/lesson-cell';

interface ClassScheduleTableProps {
  classes: Class[];
  lessons: Lesson[];
  weekStart: Date;
  className?: string;
  /**
   * Включить drag n scroll функциональность
   * @default true
   */
  enableDragScroll?: boolean;
}

export const ClassScheduleTable: React.FC<ClassScheduleTableProps> = ({
  classes,
  lessons,
  weekStart,
  className,
  enableDragScroll = true,
}) => {
  const { highlight, setHighlightedTeacher, clearHighlight } = useClassScheduleStore();
  
  // Get filters from context
  const {
    getClassFilterOptions,
    isClassFilterActive,
    isClassVisible,
  } = useScheduleFiltersContext();
  
  const classFilterOptions = getClassFilterOptions(classes);

  const scheduleEntities = classes.map(classToScheduleEntity);
  
  // Filter classes based on filter state
  const filteredClasses = classes.filter(classItem => isClassVisible(classItem.id));
  const filteredScheduleEntities = filteredClasses.map(classToScheduleEntity);

  // Обработчик клика по уроку в расписании классов
  const handleLessonClick = (classId: number, day: Date, lessonNumber: number, _lesson: LessonData) => {
    // Находим урок и извлекаем ID учителя
    const lessonData = lessons.find(l => 
      l.idClass === classId && 
      l.dayOfWeek === (day.getDay() === 0 ? 7 : day.getDay()) &&
      l.lessonNumber === lessonNumber
    );

    if (!lessonData) return;

    const teacherId = lessonData.idTeacher;
    const currentHighlightedTeacherId = highlight.highlightedTeacherId;

    // Если кликнули по тому же учителю - снимаем подсветку
    if (currentHighlightedTeacherId === teacherId) {
      clearHighlight();
    } else {
      // Иначе подсвечиваем нового учителя
      setHighlightedTeacher(teacherId, day);
    }
  };

  // Проверка, должен ли урок быть подсвечен
  const isLessonHighlighted = (classId: number, day: Date, lessonNumber: number, _lesson: LessonData): boolean => {
    if (!highlight.highlightedTeacherId) return false;

    // Находим урок и проверяем, что это тот же учитель
    const lessonData = lessons.find(l => 
      l.idClass === classId && 
      l.dayOfWeek === (day.getDay() === 0 ? 7 : day.getDay()) &&
      l.lessonNumber === lessonNumber
    );

    return lessonData ? lessonData.idTeacher === highlight.highlightedTeacherId : false;
  };

  return (
    <WeekScheduleTable
      entities={scheduleEntities}
      lessons={lessons}
      weekStart={weekStart}
      className={className}
      getLessonForEntity={(classId, day, lessonNumber) => 
        getLessonForClass(lessons, classId, day, lessonNumber)
      }
      entityLabel="Классы"
      onLessonClick={handleLessonClick}
      isLessonHighlighted={isLessonHighlighted}
      enableDragScroll={enableDragScroll}
      filterOptions={classFilterOptions}
      isFilterActive={isClassFilterActive}
      filteredEntities={filteredScheduleEntities}
    />
  );
};

import React from 'react';
import type { Class, Lesson } from '../../types/schedule';
import { WeekScheduleTable } from './base/week-schedule-table';
import { classToScheduleEntity, getLessonForClass } from './adapters/schedule-adapters';

interface ClassScheduleTableProps {
  classes: Class[];
  lessons: Lesson[];
  weekStart: Date;
  className?: string;
}

export const ClassScheduleTable: React.FC<ClassScheduleTableProps> = ({
  classes,
  lessons,
  weekStart,
  className,
}) => {
  const scheduleEntities = classes.map(classToScheduleEntity);

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
      entitySubLabel="Класс"
    />
  );
};

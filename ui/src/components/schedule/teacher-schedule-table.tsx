import React from 'react';
import type { Teacher, Lesson } from '../../types/schedule';
import { WeekScheduleTable } from './base/week-schedule-table';
import { teacherToScheduleEntity, getLessonForTeacher } from './adapters/schedule-adapters';

interface TeacherScheduleTableProps {
  teachers: Teacher[];
  lessons: Lesson[];
  weekStart: Date;
  className?: string;
}

export const TeacherScheduleTable: React.FC<TeacherScheduleTableProps> = ({
  teachers,
  lessons,
  weekStart,
  className,
}) => {
  const scheduleEntities = teachers.map(teacherToScheduleEntity);

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
      entitySubLabel="Кафедра / ФИО"
    />
  );
};

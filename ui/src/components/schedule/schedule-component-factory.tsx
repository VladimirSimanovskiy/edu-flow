import React from 'react';
import { TeacherScheduleTable } from './teacher-schedule-table';
import { ClassScheduleTable } from './class-schedule-table';
import { TeacherDaySchedule } from './teacher-day-schedule';
import { ClassDaySchedule } from './class-day-schedule';
import type { 
  ScheduleType, 
  ViewType, 
  TeacherDayScheduleProps,
  TeacherWeekScheduleProps,
  ClassDayScheduleProps,
  ClassWeekScheduleProps
} from '../../types/scheduleConfig';
import type { Teacher, Class, Lesson } from '../../types/schedule';

// Конфигурация компонентов расписания
const SCHEDULE_CONFIGS = {
  teachers: {
    type: 'teachers' as const,
    title: 'Расписание учителей',
    description: 'Просмотр расписания преподавателей',
    dayComponent: TeacherDaySchedule,
    weekComponent: TeacherScheduleTable,
  },
  classes: {
    type: 'classes' as const,
    title: 'Расписание классов',
    description: 'Просмотр расписания учебных классов',
    dayComponent: ClassDaySchedule,
    weekComponent: ClassScheduleTable,
  },
} as const;

// Фабрика для получения конфигурации расписания
export const getScheduleConfig = (type: ScheduleType) => {
  return SCHEDULE_CONFIGS[type];
};

// Фабрика для рендеринга компонента расписания
export const renderScheduleComponent = (
  type: ScheduleType,
  viewType: ViewType,
  props: {
    teachers?: Teacher[];
    classes?: Class[];
    lessons: Lesson[];
    date: Date;
    weekStart?: Date;
  }
): React.ReactElement => {
  const config = getScheduleConfig(type);
  
  if (type === 'teachers') {
    if (viewType === 'day') {
      const Component = config.dayComponent as React.ComponentType<TeacherDayScheduleProps>;
      return <Component teachers={props.teachers || []} lessons={props.lessons} date={props.date} />;
    } else {
      const Component = config.weekComponent as React.ComponentType<TeacherWeekScheduleProps>;
      return <Component teachers={props.teachers || []} lessons={props.lessons} weekStart={props.weekStart!} />;
    }
  } else {
    if (viewType === 'day') {
      const Component = config.dayComponent as React.ComponentType<ClassDayScheduleProps>;
      return <Component classes={props.classes || []} lessons={props.lessons} date={props.date} />;
    } else {
      const Component = config.weekComponent as React.ComponentType<ClassWeekScheduleProps>;
      return <Component classes={props.classes || []} lessons={props.lessons} weekStart={props.weekStart!} />;
    }
  }
};

// Хук для получения конфигурации расписания
export const useScheduleConfig = (type: ScheduleType) => {
  return getScheduleConfig(type);
};

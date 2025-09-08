import { ComponentType } from 'react';
import { Teacher, Class, Lesson } from './schedule';

// Типы для конфигурации расписания
export type ScheduleType = 'teachers' | 'classes';
export type ViewType = 'day' | 'week';

// Базовые интерфейсы для компонентов расписания
export interface BaseScheduleComponentProps {
  lessons: Lesson[];
}

export interface TeacherScheduleComponentProps extends BaseScheduleComponentProps {
  teachers: Teacher[];
}

export interface ClassScheduleComponentProps extends BaseScheduleComponentProps {
  classes: Class[];
}

export interface DayScheduleComponentProps extends BaseScheduleComponentProps {
  date: Date;
}

export interface WeekScheduleComponentProps extends BaseScheduleComponentProps {
  weekStart: Date;
}

// Объединенные интерфейсы для конкретных компонентов
export interface TeacherDayScheduleProps extends TeacherScheduleComponentProps, DayScheduleComponentProps {}
export interface TeacherWeekScheduleProps extends TeacherScheduleComponentProps, WeekScheduleComponentProps {}
export interface ClassDayScheduleProps extends ClassScheduleComponentProps, DayScheduleComponentProps {}
export interface ClassWeekScheduleProps extends ClassScheduleComponentProps, WeekScheduleComponentProps {}

// Конфигурация компонентов расписания
export interface ScheduleConfig<TDayProps = unknown, TWeekProps = unknown> {
  type: ScheduleType;
  title: string;
  description: string;
  dayComponent: ComponentType<TDayProps>;
  weekComponent: ComponentType<TWeekProps>;
}

// Константы для типов расписания
export const SCHEDULE_TYPES = {
  TEACHERS: 'teachers' as const,
  CLASSES: 'classes' as const,
} as const;

// Константы для типов представления
export const VIEW_TYPES = {
  DAY: 'day' as const,
  WEEK: 'week' as const,
} as const;

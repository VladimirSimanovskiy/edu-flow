import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useTeachers, useClasses, useLessonsForWeek, useLessonsForDay } from '../../../hooks/useSchedule';
import { useScheduleDate } from '../../../hooks/useScheduleDate';
import type { Teacher, Class, Lesson } from '../../../types/schedule';

interface ScheduleDataContextValue {
  teachers: Teacher[];
  classes: Class[];
  lessons: Lesson[];
  isLoading: boolean;
  error: Error | null;
}

const ScheduleDataContext = createContext<ScheduleDataContextValue | null>(null);

interface ScheduleDataProviderProps {
  children: ReactNode;
  date: Date;
  viewType: 'day' | 'week';
}

export const ScheduleDataProvider: React.FC<ScheduleDataProviderProps> = ({
  children,
  date,
  viewType
}) => {
  const { apiDateString } = useScheduleDate(date);

  // Загружаем данные из API
  const { data: teachers, isLoading: teachersLoading, error: teachersError } = useTeachers();
  const { data: classes, isLoading: classesLoading, error: classesError } = useClasses();
  
  // Загружаем уроки в зависимости от типа представления
  const { data: dayLessons, isLoading: dayLessonsLoading, error: dayLessonsError } = useLessonsForDay(
    apiDateString,
    undefined,
    { enabled: viewType === 'day' }
  );
  
  const { data: weekLessons, isLoading: weekLessonsLoading, error: weekLessonsError } = useLessonsForWeek(
    apiDateString,
    undefined,
    { enabled: viewType === 'week' }
  );
  
  // Используем соответствующие данные в зависимости от типа представления
  const lessons = viewType === 'day' ? dayLessons : weekLessons;
  const lessonsLoading = viewType === 'day' ? dayLessonsLoading : weekLessonsLoading;
  const lessonsError = viewType === 'day' ? dayLessonsError : weekLessonsError;

  const isLoading = teachersLoading || classesLoading || lessonsLoading;
  const error = teachersError || classesError || lessonsError;

  const value: ScheduleDataContextValue = {
    teachers: teachers || [],
    classes: classes || [],
    lessons: lessons || [],
    isLoading,
    error
  };

  return (
    <ScheduleDataContext.Provider value={value}>
      {children}
    </ScheduleDataContext.Provider>
  );
};

export const useScheduleData = (): ScheduleDataContextValue => {
  const context = useContext(ScheduleDataContext);
  if (!context) {
    throw new Error('useScheduleData must be used within a ScheduleDataProvider');
  }
  return context;
};

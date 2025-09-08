import { useMemo } from 'react';
import { useLessonSchedules } from './useSchedule';

/**
 * Хук для получения номеров уроков из API
 * @returns массив номеров уроков, отсортированных по порядку
 */
export const useLessonNumbers = () => {
  const { data: lessonSchedules, isLoading, error } = useLessonSchedules();
  
  const lessonNumbers = useMemo(() => {
    if (!lessonSchedules) return [];
    
    // Извлекаем номера уроков и сортируем их
    return lessonSchedules
      .map(schedule => schedule.lessonNumber)
      .sort((a, b) => a - b);
  }, [lessonSchedules]);
  
  return {
    lessonNumbers,
    isLoading,
    error,
    lessonSchedules,
  };
};

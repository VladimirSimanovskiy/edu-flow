import { useQueryClient } from '@tanstack/react-query';
import { useLayoutEffect, useCallback } from 'react';
import { addDays, subDays, startOfWeek, addWeeks, subWeeks } from 'date-fns';
import { formatDateForApi } from '../../../utils/dateFormat';
import { apiClient } from '../../../lib/api';
import { transformLessons } from '../../../utils/dataTransform';

export const useSchedulePrefetch = () => {
  const queryClient = useQueryClient();

  const prefetchDay = useCallback(async (date: Date) => {
    const dateString = formatDateForApi(date);
    const queryKey = ["lessons", "day", dateString, undefined];
    const staleTime = 5 * 60 * 1000; // 5 minutes

    await queryClient.prefetchQuery({
      queryKey,
      queryFn: async () => {
        const lessons = await apiClient.getLessonsForDay(dateString);
        return transformLessons(lessons);
      },
      staleTime,
    });
  }, [queryClient]);

  const prefetchWeek = useCallback(async (date: Date) => {
    const weekStart = startOfWeek(date, { weekStartsOn: 1 });
    const dateString = formatDateForApi(weekStart);
    const queryKey = ["lessons", "week", dateString, undefined];

    await queryClient.prefetchQuery({
      queryKey,
      queryFn: async () => {
        const lessons = await apiClient.getLessonsForWeek(dateString);
        return transformLessons(lessons);
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  }, [queryClient]);

  const prefetchAdjacentPeriods = useCallback((currentDate: Date, viewType: 'day' | 'week') => {
    if (viewType === 'day') {
      prefetchDay(subDays(currentDate, 1));
      prefetchDay(addDays(currentDate, 1));
    } else {
      prefetchWeek(subWeeks(currentDate, 1));
      prefetchWeek(addWeeks(currentDate, 1));
    }
  }, [prefetchDay, prefetchWeek]);

  return {
    prefetchDay,
    prefetchWeek,
    prefetchAdjacentPeriods,
  };
};

export const useAutoPrefetch = (date: Date, viewType: 'day' | 'week') => {
  const { prefetchAdjacentPeriods } = useSchedulePrefetch();

  useLayoutEffect(() => {
    prefetchAdjacentPeriods(date, viewType);
  }, [date, viewType, prefetchAdjacentPeriods]);
};

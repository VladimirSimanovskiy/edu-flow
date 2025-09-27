import { useQueryClient } from '@tanstack/react-query';
import { useLayoutEffect, useCallback } from 'react';
import { addDays, subDays, startOfWeek, addWeeks, subWeeks } from 'date-fns';
import { formatDateForApi } from '../../../utils/dateFormat';
import { apiClient } from '../../../lib/api';
import { transformLessons } from '../../../utils/dataTransform';
import type { LessonFilters, LessonValuesFilters } from '../../../types/api';

export const useSchedulePrefetch = () => {
	const queryClient = useQueryClient();

	const prefetchDay = useCallback(
		async (date: Date, filters?: Omit<LessonFilters | LessonValuesFilters, 'dayOfWeek'>) => {
			const dateString = formatDateForApi(date);
			const queryKey = ['lessons', 'day', dateString, filters];
			const staleTime = 5 * 60 * 1000; // 5 minutes

			// Проверяем, есть ли уже данные в кеше
			const existingData = queryClient.getQueryData(queryKey);
			if (existingData) {
				return; // Данные уже есть, не нужно предзагружать
			}

			await queryClient.prefetchQuery({
				queryKey,
				queryFn: async () => {
					const lessons = await apiClient.getLessonsForDay(dateString, filters);
					return transformLessons(lessons);
				},
				staleTime,
			});
		},
		[queryClient]
	);

	const prefetchWeek = useCallback(
		async (date: Date, filters?: Omit<LessonFilters | LessonValuesFilters, 'date'>) => {
			const weekStart = startOfWeek(date, { weekStartsOn: 1 });
			const dateString = formatDateForApi(weekStart);
			const queryKey = ['lessons', 'week', dateString, filters];

			// Проверяем, есть ли уже данные в кеше
			const existingData = queryClient.getQueryData(queryKey);
			if (existingData) {
				return; // Данные уже есть, не нужно предзагружать
			}

			await queryClient.prefetchQuery({
				queryKey,
				queryFn: async () => {
					const lessons = await apiClient.getLessonsForWeek(dateString, filters);
					return transformLessons(lessons);
				},
				staleTime: 5 * 60 * 1000, // 5 minutes
			});
		},
		[queryClient]
	);

	const prefetchAdjacentPeriods = useCallback(
		(
			currentDate: Date,
			viewType: 'day' | 'week',
			filters?: LessonFilters | LessonValuesFilters
		) => {
			if (viewType === 'day') {
				prefetchDay(subDays(currentDate, 1), filters);
				prefetchDay(addDays(currentDate, 1), filters);
			} else {
				prefetchWeek(subWeeks(currentDate, 1), filters);
				prefetchWeek(addWeeks(currentDate, 1), filters);
			}
		},
		[prefetchDay, prefetchWeek]
	);

	return {
		prefetchDay,
		prefetchWeek,
		prefetchAdjacentPeriods,
	};
};

export const useAutoPrefetch = (
	date: Date,
	viewType: 'day' | 'week',
	filters?: LessonFilters | LessonValuesFilters
) => {
	const { prefetchAdjacentPeriods } = useSchedulePrefetch();

	useLayoutEffect(() => {
		// Добавляем небольшую задержку, чтобы не блокировать основной рендер
		const timeoutId = setTimeout(() => {
			prefetchAdjacentPeriods(date, viewType, filters);
		}, 100);

		return () => clearTimeout(timeoutId);
	}, [date, viewType, filters, prefetchAdjacentPeriods]);
};

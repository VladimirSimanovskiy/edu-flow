import { useLessonsForDay, useLessonsForWeek } from '../hooks';
export { ScheduleDataProvider, useScheduleData } from '../data/schedule-data-provider';
export { useTeachers, useClasses, useLessonsForDay, useLessonsForWeek } from '../hooks';

// Unified facade for lessons by view type
export function useLessonsByView(apiDateString: string, apiFilters: any, viewType: 'day' | 'week') {
	if (viewType === 'day') {
		return useLessonsForDay(apiDateString, apiFilters, { enabled: true });
	}
	return useLessonsForWeek(apiDateString, apiFilters, { enabled: true });
}

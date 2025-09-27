// API hooks
export {
	useTeachers,
	useTeacher,
	useClasses,
	useClass,
	useSubjects,
	useClassrooms,
	useLessons,
	useLessonsForDay,
	useLessonsForWeek,
	useCreateLesson,
	useUpdateLesson,
	useDeleteLesson,
	useLessonSchedules,
	useScheduleVersions,
	useCurrentScheduleVersion,
} from './useSchedule';

// Date utilities
export { useScheduleDate } from './useScheduleDate';

// Business logic
export { useScheduleLogic, type LessonData } from './useScheduleLogic';

// Performance optimization
export { useSchedulePrefetch, useAutoPrefetch } from './useSchedulePrefetch';

// Lesson numbers
export { useLessonNumbers } from './useLessonNumbers';

// Loading progress
export { useScheduleLoadingProgress } from './useScheduleLoadingProgress';

// Filters
export { useScheduleFilters } from './useScheduleFilters';

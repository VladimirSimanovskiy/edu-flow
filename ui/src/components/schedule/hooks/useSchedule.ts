import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../lib/api';
import type {
	CreateLessonRequest,
	UpdateLessonRequest,
	LessonFilters,
	LessonValuesFilters,
} from '../../../types/api';
import {
	transformTeachers,
	transformClasses,
	transformLessons,
	transformLessonSchedules,
	transformScheduleVersions,
} from '../../../utils/dataTransform';

// Teachers hooks
export const useTeachers = () => {
	return useQuery({
		queryKey: ['teachers'],
		queryFn: async () => {
			const teachers = await apiClient.getTeachers();
			return transformTeachers(teachers);
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};

export const useTeacher = (id: number) => {
	return useQuery({
		queryKey: ['teachers', id],
		queryFn: async () => {
			const teacher = await apiClient.getTeacherById(id);
			return transformTeachers([teacher])[0];
		},
		enabled: !!id,
	});
};

// Classes hooks
export const useClasses = () => {
	return useQuery({
		queryKey: ['classes'],
		queryFn: async () => {
			const classes = await apiClient.getClasses();
			return transformClasses(classes);
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};

export const useClass = (id: number) => {
	return useQuery({
		queryKey: ['classes', id],
		queryFn: async () => {
			const classData = await apiClient.getClassById(id);
			return transformClasses([classData])[0];
		},
		enabled: !!id,
	});
};

// Subjects hooks
export const useSubjects = () => {
	return useQuery({
		queryKey: ['subjects'],
		queryFn: () => apiClient.getSubjects(),
		staleTime: 10 * 60 * 1000, // 10 minutes
	});
};

// Classrooms hooks
export const useClassrooms = () => {
	return useQuery({
		queryKey: ['classrooms'],
		queryFn: () => apiClient.getClassrooms(),
		staleTime: 10 * 60 * 1000, // 10 minutes
	});
};

// Lessons hooks
export const useLessons = (filters?: LessonFilters | LessonValuesFilters) => {
	return useQuery({
		queryKey: ['lessons', filters],
		queryFn: async () => {
			const lessons = await apiClient.getLessons(filters);
			return transformLessons(lessons);
		},
		staleTime: 2 * 60 * 1000, // 2 minutes
	});
};

export const useLessonsForDay = (
	date: string,
	filters?: Omit<LessonFilters | LessonValuesFilters, 'dayOfWeek'>,
	options?: { enabled?: boolean }
) => {
	return useQuery({
		queryKey: ['lessons', 'day', date, filters],
		queryFn: async () => {
			const lessons = await apiClient.getLessonsForDay(date, filters);
			return transformLessons(lessons);
		},
		enabled: !!date && options?.enabled !== false,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes (keep in cache)
	});
};

export const useLessonsForWeek = (
	date: string,
	filters?: Omit<LessonFilters | LessonValuesFilters, 'date'>,
	options?: { enabled?: boolean }
) => {
	return useQuery({
		queryKey: ['lessons', 'week', date, filters],
		queryFn: async () => {
			const lessons = await apiClient.getLessonsForWeek(date, filters);
			return transformLessons(lessons);
		},
		enabled: !!date && options?.enabled !== false,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes (keep in cache)
	});
};

// Lesson mutations
export const useCreateLesson = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (lessonData: CreateLessonRequest) => apiClient.createLesson(lessonData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['lessons'] });
		},
	});
};

export const useUpdateLesson = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (lessonData: UpdateLessonRequest) => apiClient.updateLesson(lessonData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['lessons'] });
		},
	});
};

export const useDeleteLesson = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: number) => apiClient.deleteLesson(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['lessons'] });
		},
	});
};

// Lesson schedules hooks
export const useLessonSchedules = () => {
	return useQuery({
		queryKey: ['lesson-schedules'],
		queryFn: async () => {
			const schedules = await apiClient.getLessonSchedules();
			return transformLessonSchedules(schedules);
		},
		staleTime: 10 * 60 * 1000, // 10 minutes
	});
};

// Schedule versions hooks
export const useScheduleVersions = () => {
	return useQuery({
		queryKey: ['schedule-versions'],
		queryFn: async () => {
			const versions = await apiClient.getScheduleVersions();
			return transformScheduleVersions(versions);
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};

export const useCurrentScheduleVersion = () => {
	return useQuery({
		queryKey: ['schedule-versions', 'current'],
		queryFn: async () => {
			const version = await apiClient.getCurrentScheduleVersion();
			return transformScheduleVersions([version])[0];
		},
		staleTime: 2 * 60 * 1000, // 2 minutes
	});
};

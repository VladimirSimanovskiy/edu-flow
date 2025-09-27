import React, { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import {
	useTeachers,
	useClasses,
	useLessonsForWeek,
	useLessonsForDay,
	useScheduleDate,
	useAutoPrefetch,
} from '../hooks';
import {
	ScheduleLoadingService,
	StateProviderFactory,
} from '../../../services/scheduleLoadingService';
import type { Teacher, Class, Lesson } from '../../../types/schedule';
import type { ScheduleLoadingState } from '../../../types/scheduleLoading';
import { useScheduleFiltersContext } from '../filters/context/ScheduleFiltersContext';

interface ScheduleDataContextValue {
	teachers: Teacher[];
	classes: Class[];
	lessons: Lesson[];
	loadingState: ScheduleLoadingState;
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
	viewType,
}) => {
	const { apiDateString } = useScheduleDate(date);

	// Получаем фильтры из контекста
	const { toApiFilters } = useScheduleFiltersContext();
	const apiFilters = toApiFilters();

	// Автоматическая предзагрузка соседних периодов с фильтрами
	useAutoPrefetch(date, viewType, apiFilters);

	// Загружаем данные из API
	const {
		data: teachers,
		isLoading: teachersLoading,
		isFetching: teachersFetching,
		error: teachersError,
	} = useTeachers();

	const {
		data: classes,
		isLoading: classesLoading,
		isFetching: classesFetching,
		error: classesError,
	} = useClasses();

	// Загружаем уроки в зависимости от типа представления с фильтрами
	const {
		data: dayLessons,
		isLoading: dayLessonsLoading,
		isFetching: dayLessonsFetching,
		error: dayLessonsError,
	} = useLessonsForDay(apiDateString, apiFilters, { enabled: viewType === 'day' });

	const {
		data: weekLessons,
		isLoading: weekLessonsLoading,
		isFetching: weekLessonsFetching,
		error: weekLessonsError,
	} = useLessonsForWeek(apiDateString, apiFilters, { enabled: viewType === 'week' });

	// Используем соответствующие данные в зависимости от типа представления
	const lessons = viewType === 'day' ? dayLessons : weekLessons;
	const lessonsLoading = viewType === 'day' ? dayLessonsLoading : weekLessonsLoading;
	const lessonsFetching = viewType === 'day' ? dayLessonsFetching : weekLessonsFetching;
	const lessonsError = viewType === 'day' ? dayLessonsError : weekLessonsError;

	// Создаем провайдеры состояний загрузки
	const loadingState = useMemo(() => {
		const hasTeachers = !!teachers && Array.isArray(teachers) && teachers.length > 0;
		const hasClasses = !!classes && Array.isArray(classes) && classes.length > 0;
		const hasLessons = !!lessons && Array.isArray(lessons) && lessons.length > 0;
		const hasAnyData = hasTeachers || hasClasses || hasLessons;

		const loadingProvider = StateProviderFactory.createLoadingProvider(
			teachersLoading || classesLoading || lessonsLoading,
			teachersError || classesError || lessonsError
		);

		const refreshingProvider = StateProviderFactory.createRefreshingProvider(
			teachersFetching || classesFetching || lessonsFetching,
			hasAnyData,
			teachersError || classesError || lessonsError
		);

		const initializingProvider = StateProviderFactory.createInitializingProvider(
			teachersLoading || classesLoading || lessonsLoading,
			hasAnyData,
			teachersError || classesError || lessonsError
		);

		const backgroundUpdateProvider = StateProviderFactory.createBackgroundUpdateProvider(
			teachersFetching || classesFetching || lessonsFetching,
			hasAnyData,
			teachersError || classesError || lessonsError
		);

		const loadingService = new ScheduleLoadingService(
			loadingProvider,
			refreshingProvider,
			initializingProvider,
			backgroundUpdateProvider
		);

		return loadingService.getScheduleLoadingState();
	}, [
		teachers,
		classes,
		lessons,
		teachersLoading,
		classesLoading,
		lessonsLoading,
		teachersFetching,
		classesFetching,
		lessonsFetching,
		teachersError,
		classesError,
		lessonsError,
	]);

	// Предзагрузка теперь происходит автоматически через useAutoPrefetch

	const value: ScheduleDataContextValue = {
		teachers: teachers || [],
		classes: classes || [],
		lessons: lessons || [],
		loadingState,
	};

	return <ScheduleDataContext.Provider value={value}>{children}</ScheduleDataContext.Provider>;
};

export const useScheduleData = (): ScheduleDataContextValue => {
	const context = useContext(ScheduleDataContext);
	if (!context) {
		throw new Error('useScheduleData must be used within a ScheduleDataProvider');
	}
	return context;
};

import { useState, useCallback, useMemo } from 'react';
import type { Teacher, Class } from '@/types/schedule';
import type { ValuesFilterOptions } from '@/types/valuesFilter';
import type { LessonValuesFilters } from '@/types/api';
import { ScheduleFilterService } from '@/services/filters';
import type { ScheduleFilterState } from '@/services/filters/types';

// Use ScheduleFilterState from filters service to avoid type divergence

export interface UseScheduleFiltersProps {
	teachers: Teacher[];
	classes: Class[];
	onFiltersChange?: (filters: ScheduleFilterState) => void;
}

export const useScheduleFilters = ({
	teachers,
	classes,
	onFiltersChange,
}: UseScheduleFiltersProps) => {
	const filterService = useMemo(() => new ScheduleFilterService(), []);
	const [filters, setFilters] = useState<ScheduleFilterState>(() =>
		filterService.createInitialState()
	);

	// Teacher filter options
	const teacherFilterOptions: ValuesFilterOptions<number> = useMemo(() => {
		const updateTeacherFilter = (inList: boolean, items: number[]) => {
			setFilters(prevFilters => {
				const newFilters = filterService.updateFilter(prevFilters, 'teachers', {
					inList,
					items,
				});
				onFiltersChange?.(newFilters);
				return newFilters;
			});
		};

		return filterService.getFilterOptions(
			filters.teachers,
			teachers,
			teacher => `${teacher.firstName} ${teacher.lastName}`,
			updateTeacherFilter
		);
	}, [teachers, filters.teachers, onFiltersChange, filterService]);

	// Class filter options
	const classFilterOptions: ValuesFilterOptions<number> = useMemo(() => {
		const updateClassFilter = (inList: boolean, items: number[]) => {
			setFilters(prevFilters => {
				const newFilters = filterService.updateFilter(prevFilters, 'classes', {
					inList,
					items,
				});
				onFiltersChange?.(newFilters);
				return newFilters;
			});
		};

		return filterService.getFilterOptions(
			filters.classes,
			classes,
			classItem => classItem.name,
			updateClassFilter
		);
	}, [classes, filters.classes, onFiltersChange, filterService]);

	// Check if filters are active
	const isTeacherFilterActive = filterService.isFilterActive(filters, 'teachers');
	const isClassFilterActive = filterService.isFilterActive(filters, 'classes');

	// Clear all filters
	const clearFilters = useCallback(() => {
		const clearedFilters = filterService.clearAllFilters();
		setFilters(clearedFilters);
		onFiltersChange?.(clearedFilters);
	}, [onFiltersChange, filterService, filters]);

	// Check if entity should be visible based on filters
	const isTeacherVisible = useCallback(
		(teacherId: number) => {
			return filterService.isItemVisible(filters.teachers, teacherId);
		},
		[filters.teachers, filterService]
	);

	const isClassVisible = useCallback(
		(classId: number) => {
			return filterService.isItemVisible(filters.classes, classId);
		},
		[filters.classes, filterService]
	);

	// Convert filters to API format
	const toApiFilters = useCallback((): LessonValuesFilters => {
		return filterService.toApiFormat(filters);
	}, [filters, filterService]);

	return {
		filters,
		teacherFilterOptions,
		classFilterOptions,
		isTeacherFilterActive,
		isClassFilterActive,
		clearFilters,
		isTeacherVisible,
		isClassVisible,
		toApiFilters,
	};
};

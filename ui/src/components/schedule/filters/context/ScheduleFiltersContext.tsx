import React, { createContext, useContext, useCallback, useMemo } from 'react';
import type { Teacher, Class } from '../../../../types/schedule';
import type { LessonValuesFilters } from '../../../../types/api';
import { ScheduleFilterService } from '../../../../services/filters';
import type { ScheduleFilterState } from '../../../../services/filters/types';

export interface ScheduleFiltersContextValue {
  // State
  filters: ScheduleFilterState;
  
  // Actions
  updateTeacherFilter: (inList: boolean, items: number[]) => void;
  updateClassFilter: (inList: boolean, items: number[]) => void;
  clearAllFilters: () => void;
  
  // Computed values
  isTeacherFilterActive: boolean;
  isClassFilterActive: boolean;
  isTeacherVisible: (teacherId: number) => boolean;
  isClassVisible: (classId: number) => boolean;
  
  // Filter options for components
  getTeacherFilterOptions: (teachers: Teacher[]) => any;
  getClassFilterOptions: (classes: Class[]) => any;
  
  // API integration
  toApiFilters: () => LessonValuesFilters;
}

const ScheduleFiltersContext = createContext<ScheduleFiltersContextValue | null>(null);


interface ScheduleFiltersProviderProps {
  children: React.ReactNode;
  onFiltersChange?: (filters: ScheduleFilterState) => void;
}

export const ScheduleFiltersProvider: React.FC<ScheduleFiltersProviderProps> = ({
  children,
  onFiltersChange,
}) => {
  const filterService = useMemo(() => new ScheduleFilterService(), []);
  const [filters, setFilters] = React.useState<ScheduleFilterState>(() => filterService.createInitialState());

  // Update teacher filter
  const updateTeacherFilter = useCallback((inList: boolean, items: number[]) => {
    setFilters(prev => {
      const newFilters = filterService.updateFilter(prev, 'teachers', { inList, items });
      onFiltersChange?.(newFilters);
      return newFilters;
    });
  }, [onFiltersChange, filterService]);

  // Update class filter
  const updateClassFilter = useCallback((inList: boolean, items: number[]) => {
    setFilters(prev => {
      const newFilters = filterService.updateFilter(prev, 'classes', { inList, items });
      onFiltersChange?.(newFilters);
      return newFilters;
    });
  }, [onFiltersChange, filterService]);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    const clearedFilters = filterService.clearAllFilters();
    setFilters(clearedFilters);
    onFiltersChange?.(clearedFilters);
  }, [onFiltersChange, filterService, filters]);

  // Check if filters are active
  const isTeacherFilterActive = useMemo(() => {
    return filterService.isFilterActive(filters, 'teachers');
  }, [filters, filterService]);

  const isClassFilterActive = useMemo(() => {
    return filterService.isFilterActive(filters, 'classes');
  }, [filters, filterService]);

  // Visibility functions
  const isTeacherVisible = useCallback((teacherId: number) => {
    return filterService.isItemVisible(filters.teachers, teacherId);
  }, [filters.teachers, filterService]);

  const isClassVisible = useCallback((classId: number) => {
    return filterService.isItemVisible(filters.classes, classId);
  }, [filters.classes, filterService]);

  // Generate filter options for components
  const getTeacherFilterOptions = useCallback((teachers: Teacher[]) => {
    return filterService.getFilterOptions(
      filters.teachers,
      teachers,
      (teacher) => `${teacher.firstName} ${teacher.lastName}`,
      updateTeacherFilter
    );
  }, [filters.teachers, updateTeacherFilter, filterService]);

  const getClassFilterOptions = useCallback((classes: Class[]) => {
    return filterService.getFilterOptions(
      filters.classes,
      classes,
      (classItem) => `${classItem.grade}${classItem.letter}`,
      updateClassFilter
    );
  }, [filters.classes, updateClassFilter, filterService]);

  // Convert filters to API format
  const toApiFilters = useCallback((): LessonValuesFilters => {
    return filterService.toApiFormat(filters);
  }, [filters, filterService]);

  const contextValue: ScheduleFiltersContextValue = useMemo(() => ({
    filters,
    updateTeacherFilter,
    updateClassFilter,
    clearAllFilters,
    isTeacherFilterActive,
    isClassFilterActive,
    isTeacherVisible,
    isClassVisible,
    getTeacherFilterOptions,
    getClassFilterOptions,
    toApiFilters,
  }), [
    filters,
    updateTeacherFilter,
    updateClassFilter,
    clearAllFilters,
    isTeacherFilterActive,
    isClassFilterActive,
    isTeacherVisible,
    isClassVisible,
    getTeacherFilterOptions,
    getClassFilterOptions,
    toApiFilters,
  ]);

  return (
    <ScheduleFiltersContext.Provider value={contextValue}>
      {children}
    </ScheduleFiltersContext.Provider>
  );
};

// Custom hook to use the context
export const useScheduleFiltersContext = (): ScheduleFiltersContextValue => {
  const context = useContext(ScheduleFiltersContext);
  if (!context) {
    throw new Error('useScheduleFiltersContext must be used within a ScheduleFiltersProvider');
  }
  return context;
};

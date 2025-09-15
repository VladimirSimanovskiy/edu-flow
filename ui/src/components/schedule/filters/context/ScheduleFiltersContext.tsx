import React, { createContext, useContext, useCallback, useMemo } from 'react';
import type { Teacher, Class } from '@shared/types';
import type { LessonValuesFilters } from '@shared/types';

// Types for filter state
export interface FilterState {
  teachers: {
    inList: boolean;
    items: number[];
  };
  classes: {
    inList: boolean;
    items: number[];
  };
}

export interface ScheduleFiltersContextValue {
  // State
  filters: FilterState;
  
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

// Initial state
const initialFilterState: FilterState = {
  teachers: { inList: false, items: [] },
  classes: { inList: false, items: [] },
};

interface ScheduleFiltersProviderProps {
  children: React.ReactNode;
  onFiltersChange?: (filters: FilterState) => void;
}

export const ScheduleFiltersProvider: React.FC<ScheduleFiltersProviderProps> = ({
  children,
  onFiltersChange,
}) => {
  const [filters, setFilters] = React.useState<FilterState>(initialFilterState);

  // Update teacher filter
  const updateTeacherFilter = useCallback((inList: boolean, items: number[]) => {
    setFilters(prev => {
      const newFilters = { ...prev, teachers: { inList, items } };
      onFiltersChange?.(newFilters);
      return newFilters;
    });
  }, [onFiltersChange]);

  // Update class filter
  const updateClassFilter = useCallback((inList: boolean, items: number[]) => {
    setFilters(prev => {
      const newFilters = { ...prev, classes: { inList, items } };
      onFiltersChange?.(newFilters);
      return newFilters;
    });
  }, [onFiltersChange]);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setFilters(initialFilterState);
    onFiltersChange?.(initialFilterState);
  }, [onFiltersChange]);

  // Check if filters are active
  const isTeacherFilterActive = useMemo(() => {
    return filters.teachers.inList ? 
      filters.teachers.items.length > 0 : 
      true; // Always active when inList = false
  }, [filters.teachers]);

  const isClassFilterActive = useMemo(() => {
    return filters.classes.inList ? 
      filters.classes.items.length > 0 : 
      true; // Always active when inList = false
  }, [filters.classes]);

  // Visibility functions
  const isTeacherVisible = useCallback((teacherId: number) => {
    if (!isTeacherFilterActive) return true;
    
    if (filters.teachers.inList) {
      return filters.teachers.items.includes(teacherId);
    } else {
      return !filters.teachers.items.includes(teacherId);
    }
  }, [filters.teachers, isTeacherFilterActive]);

  const isClassVisible = useCallback((classId: number) => {
    if (!isClassFilterActive) return true;
    
    if (filters.classes.inList) {
      return filters.classes.items.includes(classId);
    } else {
      return !filters.classes.items.includes(classId);
    }
  }, [filters.classes, isClassFilterActive]);

  // Generate filter options for components
  const getTeacherFilterOptions = useCallback((teachers: Teacher[]) => ({
    onFilterChanged: updateTeacherFilter,
    valueView: (teacherId: number) => {
      const teacher = teachers.find(t => t.id === teacherId);
      return teacher ? `${teacher.firstName} ${teacher.lastName}` : `Teacher ${teacherId}`;
    },
    fetchData: async (page: number, searchQuery = '') => {
      const filteredTeachers = teachers.filter(teacher => {
        const fullName = `${teacher.firstName} ${teacher.lastName}`.toLowerCase();
        return fullName.includes(searchQuery.toLowerCase());
      });

      const pageSize = 20;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const pageTeachers = filteredTeachers.slice(startIndex, endIndex);

      return {
        values: pageTeachers.map(t => t.id),
        fullLoaded: endIndex >= filteredTeachers.length,
      };
    },
    initState: {
      inList: filters.teachers.inList,
      itemsList: filters.teachers.items,
    },
    searchPlaceholder: "Поиск учителей...",
    selectAllText: "Все учителя",
    loadingText: "Загрузка учителей...",
  }), [filters.teachers, updateTeacherFilter]);

  const getClassFilterOptions = useCallback((classes: Class[]) => ({
    onFilterChanged: updateClassFilter,
    valueView: (classId: number) => {
      const classItem = classes.find(c => c.id === classId);
      return classItem ? `${classItem.grade}${classItem.letter}` : `Class ${classId}`;
    },
    fetchData: async (page: number, searchQuery = '') => {
      const filteredClasses = classes.filter(classItem => {
        return `${classItem.grade}${classItem.letter}`.toLowerCase().includes(searchQuery.toLowerCase());
      });

      const pageSize = 20;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const pageClasses = filteredClasses.slice(startIndex, endIndex);

      return {
        values: pageClasses.map(c => c.id),
        fullLoaded: endIndex >= filteredClasses.length,
      };
    },
    initState: {
      inList: filters.classes.inList,
      itemsList: filters.classes.items,
    },
    searchPlaceholder: "Поиск классов...",
    selectAllText: "Все классы",
    loadingText: "Загрузка классов...",
  }), [filters.classes, updateClassFilter]);

  // Convert filters to API format
  const toApiFilters = useCallback((): LessonValuesFilters => {
    const apiFilters: LessonValuesFilters = {};
    
    // Only include filters that have items selected
    if (filters.teachers.items.length > 0) {
      apiFilters.teachers = {
        inList: filters.teachers.inList,
        items: filters.teachers.items,
      };
    }
    
    if (filters.classes.items.length > 0) {
      apiFilters.classes = {
        inList: filters.classes.inList,
        items: filters.classes.items,
      };
    }
    
    return apiFilters;
  }, [filters]);

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

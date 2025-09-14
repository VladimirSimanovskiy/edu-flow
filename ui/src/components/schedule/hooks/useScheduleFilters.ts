import { useState, useCallback, useMemo } from 'react';
import type { Teacher, Class } from '../../../types/schedule';
import type { ValuesFilterOptions } from '../../../types/valuesFilter';

export interface ScheduleFilterState {
  teachers: {
    inList: boolean;
    items: number[];
  };
  classes: {
    inList: boolean;
    items: number[];
  };
}

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
  const [filters, setFilters] = useState<ScheduleFilterState>({
    teachers: { inList: false, items: [] },
    classes: { inList: false, items: [] },
  });

  // Stable init state for teachers
  const teacherInitState = useMemo(() => ({
    inList: filters.teachers.inList,
    itemsList: filters.teachers.items,
  }), [filters.teachers.inList, filters.teachers.items]);

  // Teacher filter options
  const teacherFilterOptions: ValuesFilterOptions<number> = useMemo(() => ({
    onFilterChanged: (inList, items) => {
      setFilters(prevFilters => {
        const newFilters = { ...prevFilters, teachers: { inList, items } };
        onFiltersChange?.(newFilters);
        return newFilters;
      });
    },
    valueView: (teacherId) => {
      const teacher = teachers.find(t => t.id === teacherId);
      return teacher ? `${teacher.firstName} ${teacher.lastName}` : `Teacher ${teacherId}`;
    },
    fetchData: async (page, searchQuery = '') => {
      // Simulate API call with pagination and search
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
    initState: teacherInitState,
    searchPlaceholder: "Поиск учителей...",
    selectAllText: "Все учителя",
    loadingText: "Загрузка учителей...",
  }), [teachers, teacherInitState, onFiltersChange]);

  // Stable init state for classes
  const classInitState = useMemo(() => ({
    inList: filters.classes.inList,
    itemsList: filters.classes.items,
  }), [filters.classes.inList, filters.classes.items]);

  // Class filter options
  const classFilterOptions: ValuesFilterOptions<number> = useMemo(() => ({
    onFilterChanged: (inList, items) => {
      setFilters(prevFilters => {
        const newFilters = { ...prevFilters, classes: { inList, items } };
        onFiltersChange?.(newFilters);
        return newFilters;
      });
    },
    valueView: (classId) => {
      const classItem = classes.find(c => c.id === classId);
      return classItem ? classItem.name : `Class ${classId}`;
    },
    fetchData: async (page, searchQuery = '') => {
      // Simulate API call with pagination and search
      const filteredClasses = classes.filter(classItem => {
        return classItem.name.toLowerCase().includes(searchQuery.toLowerCase());
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
    initState: classInitState,
    searchPlaceholder: "Поиск классов...",
    selectAllText: "Все классы",
    loadingText: "Загрузка классов...",
  }), [classes, classInitState, onFiltersChange]);

  // Check if filters are active
  // Filter is active if:
  // 1. inList = true and items.length > 0 (show only selected items)
  // 2. inList = false and items.length > 0 (hide selected items)
  // 3. inList = false and items.length = 0 (hide all items - "nothing selected" state)
  const isTeacherFilterActive = filters.teachers.inList ? 
    filters.teachers.items.length > 0 : 
    true; // Always active when inList = false (either hiding specific items or all items)
  
  const isClassFilterActive = filters.classes.inList ? 
    filters.classes.items.length > 0 : 
    true; // Always active when inList = false (either hiding specific items or all items)

  // Clear all filters
  const clearFilters = useCallback(() => {
    const clearedFilters: ScheduleFilterState = {
      teachers: { inList: false, items: [] },
      classes: { inList: false, items: [] },
    };
    setFilters(clearedFilters);
    onFiltersChange?.(clearedFilters);
  }, [onFiltersChange]);

  // Check if entity should be visible based on filters
  const isTeacherVisible = useCallback((teacherId: number) => {
    if (!isTeacherFilterActive) return true;
    
    if (filters.teachers.inList) {
      // Show only selected items
      return filters.teachers.items.includes(teacherId);
    } else {
      // Hide selected items (or hide all if items is empty)
      return !filters.teachers.items.includes(teacherId);
    }
  }, [filters.teachers, isTeacherFilterActive]);

  const isClassVisible = useCallback((classId: number) => {
    if (!isClassFilterActive) return true;
    
    if (filters.classes.inList) {
      // Show only selected items
      return filters.classes.items.includes(classId);
    } else {
      // Hide selected items (or hide all if items is empty)
      return !filters.classes.items.includes(classId);
    }
  }, [filters.classes, isClassFilterActive]);

  return {
    filters,
    teacherFilterOptions,
    classFilterOptions,
    isTeacherFilterActive,
    isClassFilterActive,
    clearFilters,
    isTeacherVisible,
    isClassVisible,
  };
};

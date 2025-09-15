import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import type { 
  FilterService, 
  FilterActions, 
  FilterComputed,
  UseFilterOptions,
  UseFilterReturn
} from '../services/filters';

/**
 * Универсальный хук для работы с фильтрами
 */
export function useFilter<T extends Record<string, any>>(
  options: UseFilterOptions<T>
): UseFilterReturn<T> {
  const { service, onFiltersChange, debounceMs = 300 } = options;
  
  const [state, setState] = useState<T>(() => service.createInitialState());
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastStateRef = useRef<T>(state);

  // Действия с фильтрами
  const actions: FilterActions = useMemo(() => ({
    updateFilter: (id: string, value: any) => {
      setState(prevState => {
        const newState = service.updateFilter(prevState, id, value);
        
        // Дебаунс для вызова onFiltersChange
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
        
        debounceTimerRef.current = setTimeout(() => {
          onFiltersChange?.(newState);
        }, debounceMs);
        
        return newState;
      });
    },

    clearFilter: (id: string) => {
      setState(prevState => {
        const newState = service.clearFilter(prevState, id);
        onFiltersChange?.(newState);
        return newState;
      });
    },

    clearAllFilters: () => {
      setState(prevState => {
        const newState = service.clearAllFilters(prevState);
        onFiltersChange?.(newState);
        return newState;
      });
    },

    setFilters: (filters: T) => {
      setState(filters);
      onFiltersChange?.(filters);
    }
  }), [service, onFiltersChange, debounceMs]);

  // Вычисляемые значения
  const computed: FilterComputed = useMemo(() => ({
    isAnyFilterActive: service.isAnyFilterActive(state),
    activeFiltersCount: service.getActiveFiltersCount(state),
    apiFormat: service.toApiFormat(state)
  }), [service, state]);

  // Очистка таймера при размонтировании
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Проверяем, изменилось ли состояние для вызова onFiltersChange
  useEffect(() => {
    if (lastStateRef.current !== state) {
      lastStateRef.current = state;
    }
  }, [state]);

  return {
    state,
    actions,
    computed
  };
}

/**
 * Специализированный хук для фильтров расписания
 */
export function useScheduleFilter(
  onFiltersChange?: (filters: any) => void,
  debounceMs?: number
) {
  const { ScheduleFilterService } = require('../services/filters');
  const service = useMemo(() => new ScheduleFilterService(), []);
  
  return useFilter({
    service,
    onFiltersChange,
    debounceMs
  });
}

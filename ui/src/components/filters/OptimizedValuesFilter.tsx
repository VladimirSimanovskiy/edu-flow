import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { SearchInput } from '../ui/search-input';
import { CheckboxList } from '../ui/checkbox-list';
import { cn } from '../../utils/cn';
import type { ValuesFilterOptions, CheckboxListState, ItemValue } from '../../types/valuesFilter';

export interface OptimizedValuesFilterProps<T extends ItemValue> {
  options: ValuesFilterOptions<T>;
  className?: string;
}

export const OptimizedValuesFilter = memo<OptimizedValuesFilterProps<any>>(({
  options,
  className,
}) => {
  // Инициализация состояния с правильными значениями из initState
  const [state, setState] = useState<CheckboxListState<any>>(() => {
    if (options.initState) {
      return {
        items: [],
        toggledItems: options.initState.itemsList,
        allChecked: !options.initState.inList,
        page: 1,
        fullLoaded: false,
        inProgress: false,
        searchQuery: '',
      };
    }
    return {
      items: [],
      toggledItems: [],
      allChecked: true,
      page: 1,
      fullLoaded: false,
      inProgress: false,
      searchQuery: '',
    };
  });

  const [filterTimer, setFilterTimer] = useState<NodeJS.Timeout | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastTriggeredState, setLastTriggeredState] = useState<{allChecked: boolean, toggledItems: any[]} | null>(null);

  // Мемоизированная функция загрузки данных
  const loadData = useCallback(async (page: number, searchQuery: string = '') => {
    setState(prev => ({ ...prev, inProgress: true }));
    
    try {
      const data = await options.fetchData(page, searchQuery);
      setState(prev => ({
        ...prev,
        items: page === 1 ? data.values : [...prev.items, ...data.values],
        fullLoaded: data.fullLoaded,
        page,
        inProgress: false,
      }));
    } catch (error) {
      console.error('Error loading data:', error);
      setState(prev => ({ ...prev, inProgress: false }));
    }
  }, [options.fetchData]);

  // Инициализация состояния из опций (только один раз)
  useEffect(() => {
    if (options.initState && !isInitialized) {
      setState(prev => {
        const newAllChecked = !options.initState!.inList;
        const newToggledItems = options.initState!.itemsList;
        
        // Проверяем, нужно ли обновлять состояние
        if (prev.allChecked === newAllChecked && 
            prev.toggledItems.length === newToggledItems.length &&
            prev.toggledItems.every((item, index) => item === newToggledItems[index])) {
          setIsInitialized(true);
          return prev;
        }
        
        return {
          ...prev,
          allChecked: newAllChecked,
          toggledItems: newToggledItems,
        };
      });
      setIsInitialized(true);
    }
  }, [options.initState, isInitialized]);

  // Начальная загрузка данных
  useEffect(() => {
    if (isInitialized) {
      loadData(1, state.searchQuery);
    }
  }, [loadData, state.searchQuery, isInitialized]);

  // Мемоизированные обработчики
  const handleSearch = useCallback((searchQuery: string) => {
    setState(prev => ({ ...prev, searchQuery, page: 1, items: [] }));
  }, []);

  const handleToggleAll = useCallback(() => {
    setState(prev => ({
      ...prev,
      allChecked: !prev.allChecked,
      toggledItems: [],
    }));
  }, []);

  const handleToggleItem = useCallback((item: any) => {
    setState(prev => {
      const newToggledItems = prev.toggledItems.includes(item)
        ? prev.toggledItems.filter(v => v !== item)
        : [...prev.toggledItems, item];
      
      return { ...prev, toggledItems: newToggledItems };
    });
  }, []);

  const handleLoadMore = useCallback(() => {
    if (!state.fullLoaded && !state.inProgress) {
      loadData(state.page + 1, state.searchQuery);
    }
  }, [loadData, state.page, state.searchQuery, state.fullLoaded, state.inProgress]);

  // Мемоизированная функция проверки состояния элемента
  const isChecked = useCallback((item: any) => {
    if (state.allChecked) {
      return !state.toggledItems.includes(item);
    } else {
      return state.toggledItems.includes(item);
    }
  }, [state.allChecked, state.toggledItems]);

  // Мемоизированная функция триггера изменения фильтра
  const triggerFilterChange = useCallback((inList: boolean, items: any[]) => {
    if (filterTimer) {
      clearTimeout(filterTimer);
    }
    
    const timer = setTimeout(() => {
      options.onFilterChanged(inList, items);
    }, 300);
    
    setFilterTimer(timer);
  }, [options.onFilterChanged, filterTimer]);

  // Триггер изменения фильтра при изменении состояния
  useEffect(() => {
    if (!isInitialized) return;
    
    const items = Array.from(state.toggledItems);
    
    // Проверяем, изменилось ли состояние
    const currentState = { allChecked: state.allChecked, toggledItems: items };
    if (lastTriggeredState && 
        lastTriggeredState.allChecked === currentState.allChecked &&
        lastTriggeredState.toggledItems.length === currentState.toggledItems.length &&
        lastTriggeredState.toggledItems.every((item, index) => item === currentState.toggledItems[index])) {
      return;
    }
    
    setLastTriggeredState(currentState);
    
    if (state.allChecked) {
      triggerFilterChange(false, items);
    } else {
      if (state.toggledItems.length) {
        triggerFilterChange(true, items);
      } else {
        triggerFilterChange(false, []);
      }
    }
  }, [state.allChecked, state.toggledItems, triggerFilterChange, isInitialized, lastTriggeredState]);

  // Очистка таймера при размонтировании
  useEffect(() => {
    return () => {
      if (filterTimer) {
        clearTimeout(filterTimer);
      }
    };
  }, [filterTimer]);

  // Мемоизированные опции для CheckboxList
  const checkboxListProps = useMemo(() => ({
    items: state.items,
    toggledItems: state.toggledItems,
    allChecked: state.allChecked,
    inProgress: state.inProgress,
    fullLoaded: state.fullLoaded,
    valueView: options.valueView,
    selectAllText: options.selectAllText || "Выбрать все",
    loadingText: options.loadingText || "Загрузка...",
    onToggleAll: handleToggleAll,
    onToggleItem: handleToggleItem,
    onLoadMore: handleLoadMore,
    isChecked,
  }), [
    state.items,
    state.toggledItems,
    state.allChecked,
    state.inProgress,
    state.fullLoaded,
    options.valueView,
    options.selectAllText,
    options.loadingText,
    handleToggleAll,
    handleToggleItem,
    handleLoadMore,
    isChecked,
  ]);

  return (
    <div className={cn("w-full space-y-3", className)}>
      {/* Search Input */}
      <SearchInput
        value={state.searchQuery}
        onChange={handleSearch}
        placeholder={options.searchPlaceholder || "Поиск..."}
        debounceMs={300}
      />

      {/* Checkbox List */}
      <CheckboxList {...checkboxListProps} />
    </div>
  );
});

OptimizedValuesFilter.displayName = 'OptimizedValuesFilter';

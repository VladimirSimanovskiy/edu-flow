import type { 
  FilterService, 
  ScheduleFilterState, 
  ValuesFilterState,
  FilterState 
} from './types';

export class ScheduleFilterService implements FilterService<ScheduleFilterState> {
  /**
   * Создает начальное состояние фильтров
   */
  createInitialState(): ScheduleFilterState {
    return {
      teachers: {
        id: 'teachers',
        type: 'values',
        isActive: false,
        inList: false,
        items: []
      },
      classes: {
        id: 'classes',
        type: 'values',
        isActive: false,
        inList: false,
        items: []
      }
    };
  }

  /**
   * Обновляет фильтр
   */
  updateFilter(state: ScheduleFilterState, id: string, value: any): ScheduleFilterState {
    const newState = { ...state };
    
    if (id in newState) {
      const filter = newState[id as keyof ScheduleFilterState] as ValuesFilterState;
      if (filter.type === 'values') {
        newState[id as keyof ScheduleFilterState] = {
          ...filter,
          inList: value.inList,
          items: value.items,
          isActive: this.isFilterActive(newState, id)
        };
      }
    }
    
    return newState;
  }

  /**
   * Очищает конкретный фильтр
   */
  clearFilter(state: ScheduleFilterState, id: string): ScheduleFilterState {
    const newState = { ...state };
    
    if (id in newState) {
      const filter = newState[id as keyof ScheduleFilterState] as ValuesFilterState;
      if (filter.type === 'values') {
        newState[id as keyof ScheduleFilterState] = {
          ...filter,
          inList: false,
          items: [],
          isActive: false
        };
      }
    }
    
    return newState;
  }

  /**
   * Очищает все фильтры
   */
  clearAllFilters(state: ScheduleFilterState): ScheduleFilterState {
    return this.createInitialState();
  }

  /**
   * Проверяет, активен ли фильтр
   */
  isFilterActive(state: ScheduleFilterState, id: string): boolean {
    const filter = state[id as keyof ScheduleFilterState] as ValuesFilterState;
    if (!filter) return false;
    
    if (filter.type === 'values') {
      // Фильтр активен если:
      // 1. inList = true и есть выбранные элементы
      // 2. inList = false и есть исключенные элементы
      return filter.inList ? filter.items.length > 0 : filter.items.length > 0;
    }
    
    return false;
  }

  /**
   * Проверяет, активен ли хотя бы один фильтр
   */
  isAnyFilterActive(state: ScheduleFilterState): boolean {
    return Object.keys(state).some(id => this.isFilterActive(state, id));
  }

  /**
   * Получает количество активных фильтров
   */
  getActiveFiltersCount(state: ScheduleFilterState): number {
    return Object.keys(state).filter(id => this.isFilterActive(state, id)).length;
  }

  /**
   * Преобразует состояние фильтров в формат API
   */
  toApiFormat(state: ScheduleFilterState): Record<string, any> {
    const apiFilters: Record<string, any> = {};
    
    Object.entries(state).forEach(([key, filter]) => {
      if (filter.type === 'values' && this.isFilterActive(state, filter.id)) {
        apiFilters[key] = {
          inList: filter.inList,
          items: filter.items
        };
      }
    });
    
    return apiFilters;
  }

  /**
   * Валидирует значение фильтра
   */
  validateFilter(state: ScheduleFilterState, id: string, value: any): boolean {
    const filter = state[id as keyof ScheduleFilterState] as ValuesFilterState;
    if (!filter) return false;
    
    if (filter.type === 'values') {
      // Проверяем, что value содержит inList и items
      if (typeof value !== 'object' || value === null) return false;
      if (typeof value.inList !== 'boolean') return false;
      if (!Array.isArray(value.items)) return false;
      
      // Проверяем, что все элементы - числа
      return value.items.every((item: any) => typeof item === 'number' && !isNaN(item));
    }
    
    return false;
  }

  /**
   * Проверяет видимость элемента на основе фильтра
   */
  isItemVisible(filter: ValuesFilterState, itemId: number): boolean {
    if (!this.isFilterActive({ [filter.id]: filter } as ScheduleFilterState, filter.id)) {
      return true;
    }
    
    if (filter.inList) {
      // Показываем только выбранные элементы
      return filter.items.includes(itemId);
    } else {
      // Исключаем выбранные элементы
      return !filter.items.includes(itemId);
    }
  }

  /**
   * Получает опции для компонента фильтра
   */
  getFilterOptions<T>(
    filter: ValuesFilterState,
    data: T[],
    valueView: (item: T) => string,
    onFilterChanged: (inList: boolean, items: number[]) => void
  ) {
    return {
      onFilterChanged,
      valueView: (itemId: number) => {
        const item = data.find((item: any) => item.id === itemId);
        return item ? valueView(item) : `Item ${itemId}`;
      },
      fetchData: async (page: number, searchQuery = '') => {
        const filteredData = data.filter(item => {
          const displayValue = valueView(item).toLowerCase();
          return displayValue.includes(searchQuery.toLowerCase());
        });

        const pageSize = 20;
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const pageData = filteredData.slice(startIndex, endIndex);

        return {
          values: pageData.map((item: any) => item.id),
          fullLoaded: endIndex >= filteredData.length,
        };
      },
      initState: {
        inList: filter.inList,
        itemsList: filter.items,
      },
      searchPlaceholder: `Поиск...`,
      selectAllText: `Все`,
      loadingText: `Загрузка...`,
    };
  }
}

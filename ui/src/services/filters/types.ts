// Базовые типы для фильтров UI
export interface BaseFilterState {
  id: string;
  type: FilterType;
  isActive: boolean;
}

export type FilterType = 'values' | 'range' | 'date' | 'simple';

// Состояние фильтра со множественными значениями
export interface ValuesFilterState extends BaseFilterState {
  type: 'values';
  inList: boolean; // true = include only these, false = exclude these
  items: number[];
}

// Состояние простого фильтра
export interface SimpleFilterState extends BaseFilterState {
  type: 'simple';
  value?: string | number;
}

// Состояние диапазонного фильтра
export interface RangeFilterState extends BaseFilterState {
  type: 'range';
  min?: number;
  max?: number;
}

// Состояние дата фильтра
export interface DateFilterState extends BaseFilterState {
  type: 'date';
  startDate?: string;
  endDate?: string;
  date?: string;
}

// Объединенный тип состояния фильтра
export type FilterState = ValuesFilterState | SimpleFilterState | RangeFilterState | DateFilterState;

// Конфигурация фильтра
export interface FilterConfig {
  id: string;
  type: FilterType;
  label: string;
  placeholder?: string;
  options?: FilterOptions;
}

export interface FilterOptions {
  searchPlaceholder?: string;
  selectAllText?: string;
  loadingText?: string;
  pageSize?: number;
}

// Действия с фильтрами
export interface FilterActions {
  updateFilter: (id: string, value: any) => void;
  clearFilter: (id: string) => void;
  clearAllFilters: () => void;
  setFilters: (filters: Record<string, FilterState>) => void;
}

// Вычисляемые значения фильтров
export interface FilterComputed {
  isAnyFilterActive: boolean;
  activeFiltersCount: number;
  apiFormat: Record<string, any>;
}

// Интерфейс для сервиса фильтров
export interface FilterService<T extends Record<string, FilterState>> {
  createInitialState(): T;
  updateFilter(state: T, id: string, value: any): T;
  clearFilter(state: T, id: string): T;
  clearAllFilters(state: T): T;
  isFilterActive(state: T, id: string): boolean;
  isAnyFilterActive(state: T): boolean;
  getActiveFiltersCount(state: T): number;
  toApiFormat(state: T): Record<string, any>;
  validateFilter(state: T, id: string, value: any): boolean;
}

// Специфичные типы для расписания
export interface ScheduleFilterState {
  teachers: ValuesFilterState;
  classes: ValuesFilterState;
  [key: string]: FilterState;
}

// Опции для компонентов фильтров
export interface FilterComponentOptions<T> {
  onFilterChanged: (id: string, value: any) => void;
  valueView: (item: T) => string;
  fetchData: (page: number, searchQuery?: string) => Promise<{ values: T[]; fullLoaded: boolean }>;
  initState?: {
    inList: boolean;
    itemsList: T[];
  };
  searchPlaceholder?: string;
  selectAllText?: string;
  loadingText?: string;
}

// Хук для работы с фильтрами
export interface UseFilterOptions<T extends Record<string, FilterState>> {
  service: FilterService<T>;
  onFiltersChange?: (filters: T) => void;
  debounceMs?: number;
}

export interface UseFilterReturn<T extends Record<string, FilterState>> {
  state: T;
  actions: FilterActions;
  computed: FilterComputed;
}

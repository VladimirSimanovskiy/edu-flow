import type { 
  FilterService, 
  FilterState, 
  FilterActions, 
  FilterComputed,
  UseFilterOptions,
  UseFilterReturn
} from './types';

/**
 * Универсальный сервис для работы с фильтрами
 */
export class GenericFilterService<T extends Record<string, FilterState>> implements FilterService<T> {
  constructor(private initialState: T) {}

  createInitialState(): T {
    return { ...this.initialState };
  }

  updateFilter(state: T, id: string, value: any): T {
    const newState = { ...state };
    
    if (id in newState) {
      const filter = newState[id];
      newState[id] = {
        ...filter,
        ...value,
        isActive: this.isFilterActive(newState, id)
      };
    }
    
    return newState;
  }

  clearFilter(state: T, id: string): T {
    const newState = { ...state };
    
    if (id in newState) {
      const filter = newState[id];
      newState[id] = {
        ...filter,
        isActive: false,
        ...this.getDefaultFilterValue(filter.type)
      };
    }
    
    return newState;
  }

  clearAllFilters(state: T): T {
    return this.createInitialState();
  }

  isFilterActive(state: T, id: string): boolean {
    const filter = state[id];
    if (!filter) return false;
    
    switch (filter.type) {
      case 'values':
        return filter.inList ? filter.items.length > 0 : filter.items.length > 0;
      case 'simple':
        return filter.value !== undefined && filter.value !== null && filter.value !== '';
      case 'range':
        return filter.min !== undefined || filter.max !== undefined;
      case 'date':
        return filter.date !== undefined || filter.startDate !== undefined || filter.endDate !== undefined;
      default:
        return false;
    }
  }

  isAnyFilterActive(state: T): boolean {
    return Object.keys(state).some(id => this.isFilterActive(state, id));
  }

  getActiveFiltersCount(state: T): number {
    return Object.keys(state).filter(id => this.isFilterActive(state, id)).length;
  }

  toApiFormat(state: T): Record<string, any> {
    const apiFilters: Record<string, any> = {};
    
    Object.entries(state).forEach(([key, filter]) => {
      if (this.isFilterActive(state, filter.id)) {
        switch (filter.type) {
          case 'values':
            apiFilters[key] = {
              inList: filter.inList,
              items: filter.items
            };
            break;
          case 'simple':
            apiFilters[key] = filter.value;
            break;
          case 'range':
            if (filter.min !== undefined) apiFilters[`${key}_min`] = filter.min;
            if (filter.max !== undefined) apiFilters[`${key}_max`] = filter.max;
            break;
          case 'date':
            if (filter.date) apiFilters[`${key}_date`] = filter.date;
            if (filter.startDate) apiFilters[`${key}_start`] = filter.startDate;
            if (filter.endDate) apiFilters[`${key}_end`] = filter.endDate;
            break;
        }
      }
    });
    
    return apiFilters;
  }

  validateFilter(state: T, id: string, value: any): boolean {
    const filter = state[id];
    if (!filter) return false;
    
    switch (filter.type) {
      case 'values':
        return typeof value === 'object' && 
               value !== null && 
               typeof value.inList === 'boolean' && 
               Array.isArray(value.items);
      case 'simple':
        return value !== undefined && value !== null;
      case 'range':
        return typeof value === 'object' && 
               value !== null && 
               (typeof value.min === 'number' || typeof value.max === 'number');
      case 'date':
        return typeof value === 'object' && 
               value !== null && 
               (typeof value.date === 'string' || 
                typeof value.startDate === 'string' || 
                typeof value.endDate === 'string');
      default:
        return false;
    }
  }

  private getDefaultFilterValue(type: string): Partial<FilterState> {
    switch (type) {
      case 'values':
        return { inList: false, items: [] };
      case 'simple':
        return { value: undefined };
      case 'range':
        return { min: undefined, max: undefined };
      case 'date':
        return { date: undefined, startDate: undefined, endDate: undefined };
      default:
        return {};
    }
  }
}

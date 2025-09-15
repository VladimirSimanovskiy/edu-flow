import { z } from 'zod';
import type { 
  FilterParser, 
  QueryParams, 
  ValidationResult, 
  LessonValuesFilters,
  ValuesFilter 
} from './types';

// Схема валидации для расширенных фильтров
const lessonValuesFiltersSchema = z.object({
  // Простые фильтры
  idTeacher: z.number().int().positive().optional(),
  idClass: z.number().int().positive().optional(),
  idSubject: z.number().int().positive().optional(),
  dayOfWeek: z.number().min(0).max(6).optional(),
  idScheduleVersion: z.number().int().positive().optional(),
  date: z.string().datetime().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  
  // Множественные фильтры
  teachers: z.object({
    inList: z.boolean(),
    items: z.array(z.number().int().positive()),
  }).optional(),
  classes: z.object({
    inList: z.boolean(),
    items: z.array(z.number().int().positive()),
  }).optional(),
  subjects: z.object({
    inList: z.boolean(),
    items: z.array(z.number().int().positive()),
  }).optional(),
});

export class LessonFilterParser implements FilterParser<LessonValuesFilters> {
  /**
   * Парсит query параметры в структурированные фильтры
   */
  parse(query: QueryParams): LessonValuesFilters {
    const filters: LessonValuesFilters = {};

    // Парсим простые фильтры
    this.parseSimpleFilters(query, filters);
    
    // Парсим множественные фильтры
    this.parseValuesFilters(query, filters);

    return filters;
  }

  /**
   * Валидирует структурированные фильтры
   */
  validate(data: LessonValuesFilters): ValidationResult {
    const result = lessonValuesFiltersSchema.safeParse(data);
    
    if (!result.success) {
      return {
        isValid: false,
        errors: result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      };
    }

    // Дополнительная бизнес-логика валидации
    const businessErrors = this.validateBusinessRules(data);
    
    return {
      isValid: businessErrors.length === 0,
      errors: businessErrors
    };
  }

  /**
   * Парсит простые фильтры (одиночные значения)
   */
  private parseSimpleFilters(query: QueryParams, filters: LessonValuesFilters): void {
    const simpleFields = [
      'idTeacher', 'idClass', 'idSubject', 'dayOfWeek', 
      'idScheduleVersion', 'date', 'startDate', 'endDate'
    ] as const;

    simpleFields.forEach(field => {
      const value = query[field];
      if (value !== undefined && value !== null && value !== '') {
        if (typeof value === 'string') {
          const parsed = this.parseSimpleValue(value, field);
          if (parsed !== undefined) {
            (filters as any)[field] = parsed;
          }
        }
      }
    });
  }

  /**
   * Парсит множественные фильтры (teachers, classes, subjects)
   */
  private parseValuesFilters(query: QueryParams, filters: LessonValuesFilters): void {
    const valuesFields = ['teachers', 'classes', 'subjects'] as const;

    valuesFields.forEach(field => {
      const inListKey = `${field}.inList` as keyof QueryParams;
      const itemsKey = `${field}.items` as keyof QueryParams;

      if (query[inListKey] !== undefined) {
        const inList = query[inListKey] === 'true';
        const items = this.parseItemsArray(query[itemsKey]);

        if (items.length > 0) {
          (filters as any)[field] = {
            inList,
            items
          };
        }
      }
    });
  }

  /**
   * Парсит значение простого фильтра в зависимости от типа поля
   */
  private parseSimpleValue(value: string, field: string): number | string | undefined {
    const numericFields = ['idTeacher', 'idClass', 'idSubject', 'dayOfWeek', 'idScheduleVersion'];
    
    if (numericFields.includes(field)) {
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? undefined : parsed;
    }
    
    return value;
  }

  /**
   * Парсит массив элементов из query параметра
   */
  private parseItemsArray(value: string | string[] | undefined): number[] {
    if (!value) return [];

    const itemsArray = Array.isArray(value) ? value : [value];
    const parsedItems: number[] = [];

    itemsArray.forEach(item => {
      const parsed = parseInt(item, 10);
      if (!isNaN(parsed)) {
        parsedItems.push(parsed);
      }
    });

    return parsedItems;
  }

  /**
   * Валидирует бизнес-правила
   */
  private validateBusinessRules(filters: LessonValuesFilters): string[] {
    const errors: string[] = [];

    // Проверяем, что если inList = true, то items не пустой
    const valuesFields = ['teachers', 'classes', 'subjects'] as const;
    
    valuesFields.forEach(field => {
      const filter = (filters as any)[field] as ValuesFilter | undefined;
      if (filter?.inList && filter.items.length === 0) {
        errors.push(`${field} filter cannot be empty when inList is true`);
      }
    });

    // Проверяем диапазон дня недели
    if (filters.dayOfWeek !== undefined && (filters.dayOfWeek < 0 || filters.dayOfWeek > 6)) {
      errors.push('dayOfWeek must be between 0 and 6');
    }

    // Проверяем даты
    if (filters.startDate && filters.endDate) {
      const start = new Date(filters.startDate);
      const end = new Date(filters.endDate);
      if (start > end) {
        errors.push('startDate cannot be later than endDate');
      }
    }

    return errors;
  }
}

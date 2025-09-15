import type { Prisma } from '@prisma/client';

// Базовые типы для фильтров
export interface BaseFilter {
  id: string;
  type: FilterType;
  isActive: boolean;
}

export type FilterType = 'values' | 'range' | 'date' | 'simple';

// Простые фильтры (одиночные значения)
export interface SimpleFilter extends BaseFilter {
  type: 'simple';
  value?: string | number;
}

// Фильтры со множественными значениями
export interface ValuesFilter extends BaseFilter {
  type: 'values';
  inList: boolean; // true = include only these, false = exclude these
  items: number[];
}

// Диапазонные фильтры
export interface RangeFilter extends BaseFilter {
  type: 'range';
  min?: number;
  max?: number;
}

// Дата фильтры
export interface DateFilter extends BaseFilter {
  type: 'date';
  startDate?: string;
  endDate?: string;
  date?: string;
}

// Объединенный тип фильтра
export type Filter = SimpleFilter | ValuesFilter | RangeFilter | DateFilter;

// Конфигурация фильтра
export interface FilterConfig {
  id: string;
  type: FilterType;
  field: string; // поле в базе данных
  required?: boolean;
  validation?: FilterValidation;
}

export interface FilterValidation {
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
}

// Результат валидации
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Парсинг query параметров
export interface QueryParams {
  [key: string]: any;
}

// Расширенные фильтры для уроков
export interface LessonValuesFilters {
  // Простые фильтры
  idTeacher?: number;
  idClass?: number;
  idSubject?: number;
  dayOfWeek?: number;
  idScheduleVersion?: number;
  date?: string;
  startDate?: string;
  endDate?: string;
  
  // Множественные фильтры
  teachers?: ValuesFilter;
  classes?: ValuesFilter;
  subjects?: ValuesFilter;
}

// Интерфейс для парсера фильтров
export interface FilterParser<T> {
  parse(query: QueryParams): T;
  validate(data: T): ValidationResult;
}

// Интерфейс для построителя запросов
export interface QueryBuilder<T> {
  buildWhereConditions(filters: T): Prisma.LessonWhereInput;
}

// Интерфейс для сервиса фильтров
export interface FilterService<T> {
  parseAndValidate(query: QueryParams): T;
  buildQuery(filters: T): Prisma.LessonWhereInput;
}

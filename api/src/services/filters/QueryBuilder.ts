import type { Prisma } from '@prisma/client';
import type { 
  QueryBuilder, 
  LessonValuesFilters,
  ValuesFilter 
} from './types';

export class LessonQueryBuilder implements QueryBuilder<LessonValuesFilters> {
  /**
   * Строит WHERE условия для Prisma запроса на основе фильтров
   */
  buildWhereConditions(filters: LessonValuesFilters): Prisma.LessonWhereInput {
    const where: Prisma.LessonWhereInput = {};

    // Добавляем простые фильтры
    this.addSimpleFilters(where, filters);
    
    // Добавляем множественные фильтры
    this.addValuesFilters(where, filters);
  
    return where;
  }

  /**
   * Добавляет простые фильтры в WHERE условие
   */
  private addSimpleFilters(
    where: Prisma.LessonWhereInput, 
    filters: LessonValuesFilters
  ): void {
    const simpleFields = [
      'idTeacher', 'idClass', 'idSubject', 'dayOfWeek', 'idScheduleVersion'
    ] as const;

    simpleFields.forEach(field => {
      const value = (filters as any)[field];
      if (value !== undefined && value !== null) {
        (where as any)[field] = value;
      }
    });
  }

  /**
   * Добавляет множественные фильтры в WHERE условие
   */
  private addValuesFilters(
    where: Prisma.LessonWhereInput, 
    filters: LessonValuesFilters
  ): void {
    // Обрабатываем фильтр учителей
    if (filters.teachers) {
      this.addValuesFilter(where, 'idTeacher', filters.teachers);
    }

    // Обрабатываем фильтр классов
    if (filters.classes) {
      this.addValuesFilter(where, 'idClass', filters.classes);
    }

    // Обрабатываем фильтр предметов
    if (filters.subjects) {
      this.addValuesFilter(where, 'idSubject', filters.subjects);
    }
  }

  /**
   * Добавляет множественный фильтр для конкретного поля
   */
  private addValuesFilter(
    where: Prisma.LessonWhereInput,
    field: string,
    filter: ValuesFilter
  ): void {
    const { inList, items } = filter;
    
    if (items.length > 0) {
      if (inList) {
        // Включаем только выбранные элементы
        (where as any)[field] = { in: items };
      } else {
        // Исключаем выбранные элементы
        (where as any)[field] = { notIn: items };
      }
    }
  }

  /**
   * Создает WHERE условие для фильтрации по дате
   */
  buildDateFilter(date: string): Prisma.LessonWhereInput {
    return {
      dayOfWeek: this.getDayOfWeekFromDate(date)
    };
  }

  /**
   * Создает WHERE условие для фильтрации по диапазону дат
   */
  buildDateRangeFilter(startDate: string, endDate: string): Prisma.LessonWhereInput {
    const startDay = this.getDayOfWeekFromDate(startDate);
    const endDay = this.getDayOfWeekFromDate(endDate);
    
    if (startDay === endDay) {
      return { dayOfWeek: startDay };
    }
    
    // Если диапазон охватывает несколько дней недели
    return {
      dayOfWeek: {
        gte: startDay,
        lte: endDay
      }
    };
  }

  /**
   * Получает день недели из даты (1 = понедельник, 7 = воскресенье)
   */
  public getDayOfWeekFromDate(dateString: string): number {
    const date = new Date(dateString);
    const dayOfWeek = date.getDay();
    // Преобразуем в формат БД: понедельник = 1, воскресенье = 7
    return dayOfWeek === 0 ? 7 : dayOfWeek;
  }

  /**
   * Создает WHERE условие для текущей версии расписания
   */
  buildScheduleVersionFilter(date?: string): Prisma.ScheduleVersionWhereInput {
    const targetDate = date ? new Date(date) : new Date();
    
    return {
      AND: [
        { dateBegin: { lte: targetDate } },
        {
          OR: [
            { dateEnd: null },
            { dateEnd: { gte: targetDate } }
          ]
        }
      ]
    };
  }

  /**
   * Комбинирует фильтры уроков с фильтром версии расписания
   */
  buildCombinedFilter(
    lessonFilters: LessonValuesFilters,
    scheduleVersionId?: number
  ): Prisma.LessonWhereInput {
    const where = this.buildWhereConditions(lessonFilters);
    
    if (scheduleVersionId) {
      where.idScheduleVersion = scheduleVersionId;
    }
    
    return where;
  }
}

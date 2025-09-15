import type { Prisma } from '@prisma/client';
import type { 
  FilterService, 
  QueryParams, 
  LessonValuesFilters 
} from './types';
import { LessonFilterParser } from './FilterParser';
import { LessonQueryBuilder } from './QueryBuilder';

export class LessonFilterService implements FilterService<LessonValuesFilters> {
  private parser: LessonFilterParser;
  private queryBuilder: LessonQueryBuilder;

  constructor() {
    this.parser = new LessonFilterParser();
    this.queryBuilder = new LessonQueryBuilder();
  }

  /**
   * Парсит и валидирует query параметры
   */
  parseAndValidate(query: QueryParams): LessonValuesFilters {
    const filters = this.parser.parse(query);
    const validation = this.parser.validate(filters);
    
    if (!validation.isValid) {
      throw new Error(`Filter validation failed: ${validation.errors.join(', ')}`);
    }
    
    return filters;
  }

  /**
   * Строит Prisma WHERE условие из фильтров
   */
  buildQuery(filters: LessonValuesFilters): Prisma.LessonWhereInput {
    return this.queryBuilder.buildWhereConditions(filters);
  }

  /**
   * Получает текущую версию расписания для указанной даты
   */
  async getCurrentScheduleVersion(
    prisma: Prisma.TransactionClient,
    date?: string
  ): Promise<{ id: number } | null> {
    const where = this.queryBuilder.buildScheduleVersionFilter(date);
    
    const version = await prisma.scheduleVersion.findFirst({
      where,
      orderBy: { dateBegin: 'desc' },
      select: { id: true }
    });
    
    return version;
  }

  /**
   * Создает полный фильтр с версией расписания
   */
  async buildCompleteFilter(
    prisma: Prisma.TransactionClient,
    query: QueryParams,
    date?: string
  ): Promise<{
    where: Prisma.LessonWhereInput;
    scheduleVersionId?: number;
  }> {
    // Парсим и валидируем фильтры
    const filters = this.parseAndValidate(query);
    
    // Получаем версию расписания
    const scheduleVersion = await this.getCurrentScheduleVersion(prisma, date);
    
    if (!scheduleVersion && date) {
      // Если указана дата, но нет версии расписания, возвращаем пустой результат
      return { where: { id: -1 } }; // Несуществующий ID
    }
    
    // Строим WHERE условие
    const where = this.queryBuilder.buildCombinedFilter(filters, scheduleVersion?.id);
    
    return {
      where,
      scheduleVersionId: scheduleVersion?.id
    };
  }

  /**
   * Создает фильтр для конкретного дня
   */
  async buildDayFilter(
    prisma: Prisma.TransactionClient,
    date: string,
    query: QueryParams
  ): Promise<Prisma.LessonWhereInput> {
    const { where } = await this.buildCompleteFilter(prisma, query, date);
    
    // Добавляем фильтр по дню недели
    const dayOfWeek = this.queryBuilder.getDayOfWeekFromDate(date);
    where.dayOfWeek = dayOfWeek;
    
    return where;
  }

  /**
   * Создает фильтр для недели
   */
  async buildWeekFilter(
    prisma: Prisma.TransactionClient,
    weekStartDate: string,
    query: QueryParams
  ): Promise<Prisma.LessonWhereInput> {
    const { where } = await this.buildCompleteFilter(prisma, query, weekStartDate);
    
    // Для недели не добавляем фильтр по дню недели
    return where;
  }
}

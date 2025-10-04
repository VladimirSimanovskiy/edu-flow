import { PrismaClient } from '@prisma/client';
import { CrudRepository, CrudEntity, CrudFilters } from '../types/crud';

/**
 * Универсальный CRUD репозиторий
 * Реализует базовые операции для любой сущности
 */
export class GenericCrudRepository<T extends CrudEntity> implements CrudRepository<T> {
  protected prisma: PrismaClient;
  protected modelName: string;
  protected searchFields: string[];
  protected sortFields: string[];

  constructor(
    prisma: PrismaClient,
    modelName: string,
    searchFields: string[],
    sortFields: string[]
  ) {
    this.prisma = prisma;
    this.modelName = modelName;
    this.searchFields = searchFields;
    this.sortFields = sortFields;
  }

  async findMany(filters?: CrudFilters): Promise<T[]> {
    const {
      page = 1,
      limit = 10,
      sortBy,
      sortOrder = 'asc',
      search
    } = filters || {};

    const skip = (page - 1) * limit;
    const take = limit;

    // Построение условий поиска
    const where = this.buildWhereClause(search);

    // Построение сортировки
    const orderBy = this.buildOrderByClause(sortBy, sortOrder);

    const model = (this.prisma as any)[this.modelName];
    return model.findMany({
      where,
      orderBy,
      skip,
      take,
    });
  }

  async findById(id: number): Promise<T | null> {
    const model = (this.prisma as any)[this.modelName];
    return model.findUnique({
      where: { id },
    });
  }

  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    const model = (this.prisma as any)[this.modelName];
    return model.create({
      data,
    });
  }

  async update(
    id: number,
    data: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<T> {
    const model = (this.prisma as any)[this.modelName];
    return model.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<void> {
    const model = (this.prisma as any)[this.modelName];
    await model.delete({
      where: { id },
    });
  }

  async count(filters?: CrudFilters): Promise<number> {
    const { search } = filters || {};
    const where = this.buildWhereClause(search);

    const model = (this.prisma as any)[this.modelName];
    return model.count({ where });
  }

  /**
   * Построение условий поиска
   */
  private buildWhereClause(search?: string): any {
    if (!search) return {};

    return {
      OR: this.searchFields.map(field => ({
        [field]: {
          contains: search,
          mode: 'insensitive',
        },
      })),
    };
  }

  /**
   * Построение сортировки
   */
  private buildOrderByClause(sortBy?: string, sortOrder: 'asc' | 'desc' = 'asc'): any {
    if (!sortBy || !this.sortFields.includes(sortBy)) {
      return { createdAt: 'desc' };
    }

    return {
      [sortBy]: sortOrder,
    };
  }
}

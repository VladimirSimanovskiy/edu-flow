import { Request, Response } from 'express';

/**
 * Generic CRUD типы для универсального механизма
 */

export interface CrudEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CrudFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface CrudResponse<T> {
  data: T;
  success: boolean;
  message: string;
}

export interface CrudPaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  success: boolean;
  message: string;
}

export interface CrudController<T extends CrudEntity> {
  getAll(req: Request, res: Response): Promise<void>;
  getById(req: Request, res: Response): Promise<void>;
  create(req: Request, res: Response): Promise<void>;
  update(req: Request, res: Response): Promise<void>;
  delete(req: Request, res: Response): Promise<void>;
}

export interface CrudService<T extends CrudEntity> {
  findAll(filters?: CrudFilters): Promise<T[]>;
  findById(id: number): Promise<T | null>;
  create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  update(id: number, data: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>): Promise<T>;
  delete(id: number): Promise<void>;
  count(filters?: CrudFilters): Promise<number>;
}

export interface CrudRepository<T extends CrudEntity> {
  findMany(filters?: CrudFilters): Promise<T[]>;
  findById(id: number): Promise<T | null>;
  create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  update(id: number, data: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>): Promise<T>;
  delete(id: number): Promise<void>;
  count(filters?: CrudFilters): Promise<number>;
}

export interface CrudConfig<T extends CrudEntity> {
  entityName: string;
  prismaModel: string;
  validationSchema?: any;
  searchFields: string[];
  sortFields: string[];
  defaultSort: { field: string; order: 'asc' | 'desc' };
}

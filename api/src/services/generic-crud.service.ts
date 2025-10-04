import {
	CrudService,
	CrudEntity,
	CrudFilters,
	CrudPaginatedResponse,
} from "../types/crud";
import { GenericCrudRepository } from "../repositories/generic-crud.repository";
import { createError } from "../middleware/errorHandler";

/**
 * Универсальный CRUD сервис
 * Обрабатывает бизнес-логику для любой сущности
 */
export class GenericCrudService<T extends CrudEntity>
	implements CrudService<T>
{
	protected repository: GenericCrudRepository<T>;

	constructor(repository: GenericCrudRepository<T>) {
		this.repository = repository;
	}

	async findAll(filters?: CrudFilters): Promise<T[]> {
		try {
			return await this.repository.findMany(filters);
		} catch (error) {
			throw createError("Failed to fetch entities", 500);
		}
	}

	async findById(id: number): Promise<T | null> {
		try {
			if (!id || id <= 0) {
				throw createError("Invalid ID provided", 400);
			}

			const entity = await this.repository.findById(id);
			if (!entity) {
				throw createError("Entity not found", 404);
			}

			return entity;
		} catch (error: any) {
			if (error.statusCode) throw error;
			throw createError("Failed to fetch entity", 500);
		}
	}

	async create(data: Omit<T, "id" | "createdAt" | "updatedAt">): Promise<T> {
		try {
			// Валидация данных будет происходить на уровне контроллера
			return await this.repository.create(data);
		} catch (error: any) {
			if (error.code === "P2002") {
				throw createError("Entity with this data already exists", 409);
			}
			throw createError("Failed to create entity", 500);
		}
	}

	async update(
		id: number,
		data: Partial<Omit<T, "id" | "createdAt" | "updatedAt">>
	): Promise<T> {
		try {
			if (!id || id <= 0) {
				throw createError("Invalid ID provided", 400);
			}

			// Проверяем существование сущности
			const existingEntity = await this.repository.findById(id);
			if (!existingEntity) {
				throw createError("Entity not found", 404);
			}

			return await this.repository.update(id, data);
		} catch (error: any) {
			if (error.statusCode) throw error;
			if (error.code === "P2002") {
				throw createError("Entity with this data already exists", 409);
			}
			throw createError("Failed to update entity", 500);
		}
	}

	async delete(id: number): Promise<void> {
		try {
			if (!id || id <= 0) {
				throw createError("Invalid ID provided", 400);
			}

			// Проверяем существование сущности
			const existingEntity = await this.repository.findById(id);
			if (!existingEntity) {
				throw createError("Entity not found", 404);
			}

			await this.repository.delete(id);
		} catch (error: any) {
			if (error.statusCode) throw error;
			if (error.code === "P2003") {
				throw createError(
					"Cannot delete entity with related records",
					409
				);
			}
			throw createError("Failed to delete entity", 500);
		}
	}

	async count(filters?: CrudFilters): Promise<number> {
		try {
			return await this.repository.count(filters);
		} catch (error) {
			throw createError("Failed to count entities", 500);
		}
	}

	/**
	 * Получить пагинированный результат
	 */
	async findPaginated(
		filters?: CrudFilters
	): Promise<CrudPaginatedResponse<T>> {
		try {
			const { page = 1, limit = 10 } = filters || {};

			const [data, total] = await Promise.all([
				this.repository.findMany(filters),
				this.repository.count(filters),
			]);

			const totalPages = Math.ceil(total / limit);
			const hasNext = page < totalPages;
			const hasPrev = page > 1;

			return {
				data,
				pagination: {
					page,
					limit,
					total,
					totalPages,
					hasNext,
					hasPrev,
				},
				success: true,
				message: "Entities retrieved successfully",
			};
		} catch (error: any) {
			if (error.statusCode) throw error;
			throw createError("Failed to fetch paginated entities", 500);
		}
	}
}

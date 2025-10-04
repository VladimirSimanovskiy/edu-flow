import { Request, Response } from "express";
import { CrudController, CrudEntity, CrudResponse } from "../types/crud";
import { GenericCrudService } from "../services/generic-crud.service";
import { createError } from "../middleware/errorHandler";

/**
 * Универсальный CRUD контроллер
 * Обрабатывает HTTP запросы для любой сущности
 */
export class GenericCrudController<T extends CrudEntity>
	implements CrudController<T>
{
	protected service: GenericCrudService<T>;
	protected entityName: string;

	constructor(service: GenericCrudService<T>, entityName: string) {
		this.service = service;
		this.entityName = entityName;
	}

	async getAll(req: Request, res: Response): Promise<void> {
		try {
			const filters = {
				page: req.query.page
					? parseInt(req.query.page as string)
					: undefined,
				limit: req.query.limit
					? parseInt(req.query.limit as string)
					: undefined,
				sortBy: req.query.sortBy as string,
				sortOrder: req.query.sortOrder as "asc" | "desc",
				search: req.query.search as string,
			};

			const result = await this.service.findPaginated(filters);

			// result уже содержит правильную структуру с data и pagination
			// Не нужно оборачивать его в дополнительный data объект
			res.json(result);
		} catch (error) {
			this.handleError(error, res);
		}
	}

	async getById(req: Request, res: Response): Promise<void> {
		try {
			const id = parseInt(req.params.id);

			if (!id || isNaN(id)) {
				throw createError("Invalid ID provided", 400);
			}

			const entity = await this.service.findById(id);

			if (!entity) {
				throw createError("Entity not found", 404);
			}

			const response: CrudResponse<T> = {
				data: entity,
				success: true,
				message: `${this.entityName} retrieved successfully`,
			};

			res.json(response);
		} catch (error) {
			this.handleError(error, res);
		}
	}

	async create(req: Request, res: Response): Promise<void> {
		try {
			const data = req.body;

			// Валидация будет происходить через middleware
			const entity = await this.service.create(data);

			const response: CrudResponse<T> = {
				data: entity,
				success: true,
				message: `${this.entityName} created successfully`,
			};

			res.status(201).json(response);
		} catch (error) {
			this.handleError(error, res);
		}
	}

	async update(req: Request, res: Response): Promise<void> {
		try {
			const id = parseInt(req.params.id);
			const data = req.body;

			if (!id || isNaN(id)) {
				throw createError("Invalid ID provided", 400);
			}

			const entity = await this.service.update(id, data);

			const response: CrudResponse<T> = {
				data: entity,
				success: true,
				message: `${this.entityName} updated successfully`,
			};

			res.json(response);
		} catch (error) {
			this.handleError(error, res);
		}
	}

	async delete(req: Request, res: Response): Promise<void> {
		try {
			const id = parseInt(req.params.id);

			if (!id || isNaN(id)) {
				throw createError("Invalid ID provided", 400);
			}

			await this.service.delete(id);

			const response: CrudResponse<null> = {
				data: null,
				success: true,
				message: `${this.entityName} deleted successfully`,
			};

			res.json(response);
		} catch (error) {
			this.handleError(error, res);
		}
	}

	/**
	 * Обработка ошибок
	 */
	private handleError(error: any, res: Response): void {
		if (error.statusCode) {
			res.status(error.statusCode).json({
				success: false,
				message: error.message,
			});
		} else {
			res.status(500).json({
				success: false,
				message: "Internal server error",
			});
		}
	}
}

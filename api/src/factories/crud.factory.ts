import { PrismaClient } from "@prisma/client";
import { GenericCrudRepository } from "../repositories/generic-crud.repository";
import { GenericCrudService } from "../services/generic-crud.service";
import { GenericCrudController } from "../controllers/generic-crud.controller";
import { CrudEntity, CrudConfig } from "../types/crud";

/**
 * Фабрика для создания CRUD компонентов
 * Реализует Factory Pattern для универсального создания CRUD функциональности
 */
export class CrudFactory {
	private prisma: PrismaClient;

	constructor(prisma: PrismaClient) {
		this.prisma = prisma;
	}

	/**
	 * Создать полный набор CRUD компонентов для сущности
	 */
	createCrudComponents<T extends CrudEntity>(config: CrudConfig<T>) {
		// Создаем репозиторий
		const repository = new GenericCrudRepository<T>(
			this.prisma,
			config.prismaModel,
			config.searchFields,
			config.sortFields
		);

		// Создаем сервис
		const service = new GenericCrudService<T>(repository);

		// Создаем контроллер
		const controller = new GenericCrudController<T>(
			service,
			config.entityName
		);

		return {
			repository,
			service,
			controller,
		};
	}

	/**
	 * Создать только контроллер (наиболее частый случай)
	 */
	createController<T extends CrudEntity>(config: CrudConfig<T>) {
		const { controller } = this.createCrudComponents(config);
		return controller;
	}
}

/**
 * Предустановленные конфигурации для справочников
 */
export const REFERENCE_CONFIGS = {
	teacher: {
		entityName: "Teacher",
		prismaModel: "teacher",
		searchFields: ["firstName", "lastName", "middleName", "email"],
		sortFields: ["firstName", "lastName", "createdAt"],
		defaultSort: { field: "lastName", order: "asc" as const },
		validationSchema: null, // Валидация происходит в middleware
	},
	classroom: {
		entityName: "Classroom",
		prismaModel: "classroom",
		searchFields: ["number"],
		sortFields: ["number", "floor", "createdAt"],
		defaultSort: { field: "number", order: "asc" as const },
		validationSchema: null, // Валидация происходит в middleware
	},
	subject: {
		entityName: "Subject",
		prismaModel: "subject",
		searchFields: ["name", "code", "description"],
		sortFields: ["name", "code", "createdAt"],
		defaultSort: { field: "name", order: "asc" as const },
		validationSchema: null, // Валидация происходит в middleware
	},
};

import { Request, Response, NextFunction } from "express";
import { z } from "zod";

/**
 * Мягкая валидация query параметров
 * Не падает на пустых параметрах, а применяет значения по умолчанию
 */
export const softValidateQuery = (schema: z.ZodSchema) => {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			// Применяем схему с значениями по умолчанию
			const validatedQuery = schema.parse(req.query);
			// Копируем валидированные значения обратно в req.query
			Object.assign(req.query, validatedQuery);
			next();
		} catch (error) {
			// Если валидация не прошла, используем значения по умолчанию
			if (error instanceof z.ZodError) {
				// Просто применяем значения по умолчанию
				const defaultQuery = schema.parse({});
				Object.assign(req.query, defaultQuery);
				next();
			} else {
				next(error);
			}
		}
	};
};

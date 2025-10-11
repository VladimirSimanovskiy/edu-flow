import type { ReferenceConfig } from '@/types/reference-system';
import type { Subject } from '@/types/reference';
import { SubjectForm } from './subject-form';
import { SubjectService } from './subject-service';
import { subjectTableColumns } from './subject-table-config';
import { z } from 'zod';

// Схема валидации для предмета
const subjectValidationSchema = z.object({
	name: z.string().trim(),
	code: z
		.string()
		.trim()
		.transform(val => val.toUpperCase()),
	description: z.string().trim().optional().or(z.literal('')),
	createdAt: z.string(),
	updatedAt: z.string(),
});

/**
 * Конфигурация модуля справочника предметов
 * Следует принципу Single Responsibility - содержит только конфигурацию модуля
 * Следует принципу Dependency Injection - инжектирует зависимости
 */
export const SubjectModuleConfig: ReferenceConfig<Subject> = {
	title: 'Справочник предметов',
	description: 'Управление информацией о предметах школы',
	entityType: 'subject',
	columns: subjectTableColumns,
	formComponent: SubjectForm,
	apiService: new SubjectService(),
	validationSchema: subjectValidationSchema,
	sortOptions: [
		{ value: 'name', label: 'По названию' },
		{ value: 'code', label: 'По коду' },
	],
	filters: [
		{
			key: 'search',
			label: 'Поиск',
			type: 'text',
		},
	],
};

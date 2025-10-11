import type { ReferenceConfig } from '@/types/reference-system';
import type { Teacher } from '@/types/reference';
import { TeacherForm } from './teacher-form';
import { TeacherService } from './teacher-service';
import { teacherTableColumns } from './teacher-table-config';
import { z } from 'zod';

// Схема валидации для учителя
const teacherValidationSchema = z.object({
	firstName: z.string().trim(),
	lastName: z.string().trim(),
	middleName: z.string().trim().optional().or(z.literal('')),
	email: z.string().email('Некорректный email').trim().optional().or(z.literal('')),
	phone: z
		.string()
		.regex(/^[\+]?[0-9\s\-\(\)]*$/, 'Некорректный формат номера телефона')
		.trim()
		.optional()
		.or(z.literal('')),
	isActive: z.boolean(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

/**
 * Конфигурация модуля справочника учителей
 * Следует принципу Single Responsibility - содержит только конфигурацию модуля
 * Следует принципу Dependency Injection - инжектирует зависимости
 */
export const TeacherModuleConfig: ReferenceConfig<Teacher> = {
	title: 'Справочник учителей',
	description: 'Управление информацией об учителях школы',
	entityType: 'teacher',
	columns: teacherTableColumns,
	formComponent: TeacherForm,
	apiService: new TeacherService(),
	validationSchema: teacherValidationSchema,
	sortOptions: [
		{ value: 'lastName', label: 'По фамилии' },
		{ value: 'firstName', label: 'По имени' },
		{ value: 'email', label: 'По email' },
		{ value: 'isActive', label: 'По статусу' },
	],
	filters: [
		{
			key: 'search',
			label: 'Поиск',
			type: 'text',
		},
		{
			key: 'isActive',
			label: 'Статус',
			type: 'select',
			options: [
				{ value: 'true', label: 'Активен' },
				{ value: 'false', label: 'Неактивен' },
			],
		},
	],
};

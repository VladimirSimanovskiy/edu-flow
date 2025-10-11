import type { ReferenceConfig } from '@/types/reference-system';
import type { Classroom } from '@/types/reference';
import { ClassroomForm } from './classroom-form';
import { ClassroomService } from './classroom-service';
import { classroomTableColumns } from './classroom-table-config';
import { z } from 'zod';

// Схема валидации для кабинета
const classroomValidationSchema = z.object({
	number: z
		.number({
			required_error: 'Номер кабинета обязателен',
			invalid_type_error: 'Номер кабинета должен быть числом',
		})
		.int('Номер кабинета должен быть целым числом')
		.positive('Номер кабинета должен быть положительным числом'),
	floor: z
		.number({
			required_error: 'Этаж обязателен',
			invalid_type_error: 'Этаж должен быть числом',
		})
		.int('Этаж должен быть целым числом')
		.positive('Этаж должен быть положительным числом'),
	createdAt: z.string(),
	updatedAt: z.string(),
});

/**
 * Конфигурация модуля справочника кабинетов
 * Следует принципу Single Responsibility - содержит только конфигурацию модуля
 * Следует принципу Dependency Injection - инжектирует зависимости
 */
export const ClassroomModuleConfig: ReferenceConfig<Classroom> = {
	title: 'Справочник кабинетов',
	description: 'Управление информацией о кабинетах школы',
	entityType: 'classroom',
	columns: classroomTableColumns,
	formComponent: ClassroomForm,
	apiService: new ClassroomService(),
	validationSchema: classroomValidationSchema,
	sortOptions: [
		{ value: 'number', label: 'По номеру' },
		{ value: 'floor', label: 'По этажу' },
	],
	filters: [
		{
			key: 'search',
			label: 'Поиск',
			type: 'text',
		},
		{
			key: 'floor',
			label: 'Этаж',
			type: 'select',
			options: [
				{ value: '1', label: '1 этаж' },
				{ value: '2', label: '2 этаж' },
				{ value: '3', label: '3 этаж' },
				{ value: '4', label: '4 этаж' },
			],
		},
	],
};

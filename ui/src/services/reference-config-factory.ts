import { z } from 'zod';
import type {
	ReferenceConfig,
	ReferenceApiService,
	ReferenceEntity,
} from '@/types/reference-system';
import type { Teacher, Classroom, Subject } from '@/types/reference';
import {
	teacherColumns,
	classroomColumns,
	subjectColumns,
} from '@/components/reference/reference-table';

// Импортируем реальные API сервисы
import { referenceService } from './reference.service';

// API сервисы для учителей
const teacherApiService: ReferenceApiService<Teacher> = {
	getAll: async params => {
		const response = await referenceService.getTeachers(params);
		return { data: response.data || [], pagination: response.pagination };
	},
	getById: async id => {
		const response = await referenceService.getTeacher(id);
		return response.data;
	},
	create: async data => {
		const response = await referenceService.createTeacher(data);
		return response.data;
	},
	update: async (id, data) => {
		const response = await referenceService.updateTeacher(id, data);
		return response.data;
	},
	delete: async id => {
		await referenceService.deleteTeacher(id);
	},
};

// API сервисы для кабинетов
const classroomApiService: ReferenceApiService<Classroom> = {
	getAll: async params => {
		const response = await referenceService.getClassrooms(params);
		return { data: response.data || [], pagination: response.pagination };
	},
	getById: async id => {
		const response = await referenceService.getClassroom(id);
		return response.data;
	},
	create: async data => {
		const response = await referenceService.createClassroom(data);
		return response.data;
	},
	update: async (id, data) => {
		const response = await referenceService.updateClassroom(id, data);
		return response.data;
	},
	delete: async id => {
		await referenceService.deleteClassroom(id);
	},
};

// API сервисы для предметов
const subjectApiService: ReferenceApiService<Subject> = {
	getAll: async params => {
		const response = await referenceService.getSubjects(params);
		return { data: response.data || [], pagination: response.pagination };
	},
	getById: async id => {
		const response = await referenceService.getSubject(id);
		return response.data;
	},
	create: async data => {
		const response = await referenceService.createSubject(data);
		return response.data;
	},
	update: async (id, data) => {
		const response = await referenceService.updateSubject(id, data);
		return response.data;
	},
	delete: async id => {
		await referenceService.deleteSubject(id);
	},
};

// Схемы валидации (упрощенные для API)
const teacherSchema = z.object({
	firstName: z.string().min(1, 'Имя обязательно').max(50, 'Имя слишком длинное'),
	lastName: z.string().min(1, 'Фамилия обязательна').max(50, 'Фамилия слишком длинная'),
	middleName: z.string().max(50, 'Отчество слишком длинное').optional(),
	email: z
		.string()
		.email('Некорректный email')
		.max(100, 'Email слишком длинный')
		.optional()
		.or(z.literal('')),
	phone: z.string().max(20, 'Телефон слишком длинный').optional().or(z.literal('')),
	isActive: z.boolean(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

const classroomSchema = z.object({
	number: z
		.number()
		.int()
		.positive('Номер кабинета должен быть положительным числом')
		.max(999, 'Номер кабинета должен быть не более 999'),
	floor: z
		.number()
		.int()
		.min(1, 'Этаж должен быть не менее 1')
		.max(10, 'Этаж должен быть не более 10'),
	createdAt: z.string(),
	updatedAt: z.string(),
});

const subjectSchema = z.object({
	name: z
		.string()
		.min(1, 'Название предмета обязательно')
		.max(100, 'Название предмета слишком длинное'),
	code: z.string().min(1, 'Код предмета обязателен').max(20, 'Код предмета слишком длинный'),
	description: z.string().max(500, 'Описание слишком длинное').optional(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

/**
 * Factory для создания конфигураций справочников
 * Следует принципу Open/Closed - легко добавлять новые типы сущностей
 */
export class ReferenceConfigFactory {
	/**
	 * Создает конфигурацию для справочника учителей
	 */
	static createTeacherConfig(): ReferenceConfig<Teacher> {
		return {
			entityType: 'teachers',
			title: 'Учителя',
			description: 'Управление учителями в системе',
			columns: teacherColumns,
			formComponent: () => null, // Будет заменено на реальный компонент
			apiService: teacherApiService,
			validationSchema: teacherSchema,
			sortOptions: [
				{ value: 'lastName', label: 'По фамилии' },
				{ value: 'firstName', label: 'По имени' },
				{ value: 'email', label: 'По email' },
				{ value: 'createdAt', label: 'По дате создания' },
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
						{ value: 'true', label: 'Активные' },
						{ value: 'false', label: 'Неактивные' },
						{ value: '', label: 'Все' },
					],
				},
			],
		};
	}

	/**
	 * Создает конфигурацию для справочника кабинетов
	 */
	static createClassroomConfig(): ReferenceConfig<Classroom> {
		return {
			entityType: 'classrooms',
			title: 'Кабинеты',
			description: 'Управление кабинетами в системе',
			columns: classroomColumns,
			formComponent: () => null, // Будет заменено на реальный компонент
			apiService: classroomApiService,
			validationSchema: classroomSchema,
			sortOptions: [
				{ value: 'number', label: 'По номеру' },
				{ value: 'floor', label: 'По этажу' },
				{ value: 'createdAt', label: 'По дате создания' },
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
						{ value: '', label: 'Все этажи' },
					],
				},
			],
		};
	}

	/**
	 * Создает конфигурацию для справочника предметов
	 */
	static createSubjectConfig(): ReferenceConfig<Subject> {
		return {
			entityType: 'subjects',
			title: 'Предметы',
			description: 'Управление предметами в системе',
			columns: subjectColumns,
			formComponent: () => null, // Будет заменено на реальный компонент
			apiService: subjectApiService,
			validationSchema: subjectSchema,
			sortOptions: [
				{ value: 'name', label: 'По названию' },
				{ value: 'code', label: 'По коду' },
				{ value: 'createdAt', label: 'По дате создания' },
			],
			filters: [
				{
					key: 'search',
					label: 'Поиск',
					type: 'text',
				},
			],
		};
	}

	/**
	 * Универсальный метод для создания конфигурации
	 * Позволяет легко добавлять новые типы сущностей
	 */
	static createConfig<T extends ReferenceEntity>(
		entityType: string,
		title: string,
		description: string,
		columns: any[],
		formComponent: any,
		apiService: ReferenceApiService<T>,
		validationSchema: z.ZodSchema,
		sortOptions: Array<{ value: string; label: string }>,
		filters?: Array<{
			key: string;
			label: string;
			type: 'date' | 'text' | 'select';
			options?: Array<{ value: string; label: string }>;
		}>
	): ReferenceConfig<T> {
		return {
			entityType,
			title,
			description,
			columns,
			formComponent,
			apiService,
			validationSchema,
			sortOptions,
			filters,
		};
	}
}

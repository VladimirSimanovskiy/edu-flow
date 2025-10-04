import { z } from 'zod';
import type { ReferenceConfig, ReferenceApiService } from '@/types/reference-system';
import type { Teacher, Classroom, Subject } from '@/types/reference';
import {
	teacherColumns,
	classroomColumns,
	subjectColumns,
} from '@/components/reference/reference-table';

// Импортируем реальные API сервисы
import { apiClient } from '@/lib/api';

// API сервисы для учителей
const teacherApiService: ReferenceApiService<Teacher> = {
	getAll: async params => {
		const response = await apiClient.getTeachers();
		return { data: response || [], pagination: null };
	},
	getById: async id => {
		const response = await apiClient.getTeachers();
		return response.find(t => t.id === id) || ({} as Teacher);
	},
	create: async data => {
		// Заглушка - в реальном проекте будет API метод
		return { ...data, id: Date.now() } as Teacher;
	},
	update: async (id, data) => {
		// Заглушка - в реальном проекте будет API метод
		return { ...data, id } as Teacher;
	},
	delete: async id => {
		// Заглушка - в реальном проекте будет API метод
	},
};

// API сервисы для кабинетов
const classroomApiService: ReferenceApiService<Classroom> = {
	getAll: async params => {
		const response = await apiClient.getClassrooms();
		return { data: response || [], pagination: null };
	},
	getById: async id => {
		const response = await apiClient.getClassrooms();
		return response.find(c => c.id === id) || ({} as Classroom);
	},
	create: async data => {
		// Заглушка - в реальном проекте будет API метод
		return { ...data, id: Date.now() } as Classroom;
	},
	update: async (id, data) => {
		// Заглушка - в реальном проекте будет API метод
		return { ...data, id } as Classroom;
	},
	delete: async id => {
		// Заглушка - в реальном проекте будет API метод
	},
};

// API сервисы для предметов
const subjectApiService: ReferenceApiService<Subject> = {
	getAll: async params => {
		const response = await apiClient.getSubjects();
		return { data: response || [], pagination: null };
	},
	getById: async id => {
		const response = await apiClient.getSubjects();
		return response.find(s => s.id === id) || ({} as Subject);
	},
	create: async data => {
		// Заглушка - в реальном проекте будет API метод
		return { ...data, id: Date.now() } as Subject;
	},
	update: async (id, data) => {
		// Заглушка - в реальном проекте будет API метод
		return { ...data, id } as Subject;
	},
	delete: async id => {
		// Заглушка - в реальном проекте будет API метод
	},
};

// Схемы валидации
const teacherSchema = z.object({
	firstName: z.string().min(1, 'Имя обязательно'),
	lastName: z.string().min(1, 'Фамилия обязательна'),
	middleName: z.string().optional(),
	email: z.string().email('Некорректный email').optional().or(z.literal('')),
	phone: z.string().optional().or(z.literal('')),
	isActive: z.boolean(),
});

const classroomSchema = z.object({
	number: z.number().int().positive('Номер кабинета должен быть положительным числом'),
	floor: z
		.number()
		.int()
		.min(1, 'Этаж должен быть не менее 1')
		.max(10, 'Этаж должен быть не более 10'),
});

const subjectSchema = z.object({
	name: z.string().min(1, 'Название предмета обязательно'),
	code: z.string().min(1, 'Код предмета обязателен'),
	description: z.string().optional(),
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
	static createConfig<T extends any>(
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
			type: string;
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

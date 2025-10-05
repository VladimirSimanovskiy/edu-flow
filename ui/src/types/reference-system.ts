import { z } from 'zod';
import type { ColumnDef } from '@tanstack/react-table';

// Базовый интерфейс для всех справочных сущностей
export interface ReferenceEntity {
	id: number;
	createdAt?: string;
	updatedAt?: string;
}

// Колонки описываются через ColumnDef из TanStack Table

// API сервис для работы с сущностями
export interface ReferenceApiService<T extends ReferenceEntity> {
	getAll: (params?: any) => Promise<{ data: T[]; pagination?: any }>;
	getById: (id: number) => Promise<T>;
	create: (data: Omit<T, 'id'>) => Promise<T>;
	update: (id: number, data: Partial<T>) => Promise<T>;
	delete: (id: number) => Promise<void>;
}

// Пропсы для форм справочников
export interface ReferenceFormProps<T extends ReferenceEntity> {
	entity?: T;
	onSubmit: (data: Omit<T, 'id'>) => void;
	onCancel: () => void;
	isLoading?: boolean;
}

// Конфигурация справочника
export interface ReferenceConfig<T extends ReferenceEntity = ReferenceEntity> {
	entityType: string;
	title: string;
	description: string;
	columns: ColumnDef<T, any>[];
	formComponent: React.ComponentType<ReferenceFormProps<T>>;
	apiService: ReferenceApiService<T>;
	validationSchema: z.ZodSchema<Omit<T, 'id'>>;
	sortOptions: Array<{ value: string; label: string }>;
	filters?: Array<{
		key: string;
		label: string;
		type: 'text' | 'select' | 'date';
		options?: Array<{ value: string; label: string }>;
	}>;
}

// Состояние фильтров
export interface ReferenceFilters {
	search?: string;
	sortBy?: string;
	sortOrder?: 'asc' | 'desc';
	page?: number;
	limit?: number;
	[key: string]: any;
}

// Пропсы для универсальной страницы справочника
export interface ReferencePageProps<T extends ReferenceEntity = ReferenceEntity> {
	config: ReferenceConfig<T>;
}

// Пропсы для универсальной таблицы
export interface ReferenceTableProps<T extends ReferenceEntity = ReferenceEntity> {
	data: T[];
	columns: ColumnDef<T, any>[];
	isLoading?: boolean;
	onEdit: (item: T) => void;
	onDelete: (id: number) => void;
}

// Пропсы для универсальных фильтров
export interface ReferenceFiltersProps<T extends ReferenceEntity = ReferenceEntity> {
	filters: ReferenceFilters;
	onFiltersChange: (filters: ReferenceFilters) => void;
	onReset: () => void;
	sortOptions: Array<{ value: string; label: string }>;
	config: ReferenceConfig<T>;
}

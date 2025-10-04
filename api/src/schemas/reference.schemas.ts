import { z } from 'zod';

/**
 * Схемы валидации для справочников
 */

// Схема для учителя
export const teacherCreateSchema = z.object({
  firstName: z.string().min(1, 'Имя обязательно').max(50, 'Имя слишком длинное'),
  lastName: z.string().min(1, 'Фамилия обязательна').max(50, 'Фамилия слишком длинная'),
  middleName: z.string().max(50, 'Отчество слишком длинное').optional(),
  email: z.string().email('Некорректный email').optional().or(z.literal('')),
  phone: z.string().max(20, 'Телефон слишком длинный').optional().or(z.literal('')),
  isActive: z.boolean().default(true),
});

export const teacherUpdateSchema = teacherCreateSchema.partial();

// Схема для кабинета
export const classroomCreateSchema = z.object({
  number: z.number().int().positive('Номер кабинета должен быть положительным числом'),
  floor: z.number().int().min(1, 'Этаж должен быть не менее 1').max(10, 'Этаж должен быть не более 10'),
});

export const classroomUpdateSchema = classroomCreateSchema.partial();

// Схема для предмета
export const subjectCreateSchema = z.object({
  name: z.string().min(1, 'Название предмета обязательно').max(100, 'Название слишком длинное'),
  code: z.string().min(1, 'Код предмета обязателен').max(10, 'Код слишком длинный'),
  description: z.string().max(500, 'Описание слишком длинное').optional().or(z.literal('')),
});

export const subjectUpdateSchema = subjectCreateSchema.partial();

// Схема для фильтров
export const referenceFiltersSchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
  search: z.string().optional(),
});

// Схема для ID параметра
export const idParamSchema = z.object({
  id: z.coerce.number().int().positive('ID должен быть положительным числом'),
});

// Экспорт типов
export type TeacherCreateInput = z.infer<typeof teacherCreateSchema>;
export type TeacherUpdateInput = z.infer<typeof teacherUpdateSchema>;
export type ClassroomCreateInput = z.infer<typeof classroomCreateSchema>;
export type ClassroomUpdateInput = z.infer<typeof classroomUpdateSchema>;
export type SubjectCreateInput = z.infer<typeof subjectCreateSchema>;
export type SubjectUpdateInput = z.infer<typeof subjectUpdateSchema>;
export type ReferenceFilters = z.infer<typeof referenceFiltersSchema>;
export type IdParam = z.infer<typeof idParamSchema>;

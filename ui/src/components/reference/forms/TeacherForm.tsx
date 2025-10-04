import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { BaseReferenceForm } from './BaseReferenceForm';
import type { ReferenceFormProps } from '@/types/reference-system';
import type { Teacher } from '@/types/reference';

// Схема валидации
const teacherFormSchema = z.object({
	firstName: z.string().min(1, 'Имя обязательно').max(50, 'Имя слишком длинное'),
	lastName: z.string().min(1, 'Фамилия обязательна').max(50, 'Фамилия слишком длинная'),
	middleName: z.string().max(50, 'Отчество слишком длинное').optional(),
	email: z.string().email('Некорректный email').optional().or(z.literal('')),
	phone: z.string().max(20, 'Телефон слишком длинный').optional().or(z.literal('')),
	isActive: z.boolean(),
});

type TeacherFormValues = z.infer<typeof teacherFormSchema>;

/**
 * Форма для работы с учителями
 * Использует Composition Pattern - наследует структуру от BaseReferenceForm
 * Следует принципу Single Responsibility - отвечает только за поля учителя
 */
export const TeacherForm: React.FC<ReferenceFormProps<Teacher>> = ({
	entity: teacher,
	onSubmit,
	onCancel,
	isLoading = false,
}) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
	} = useForm<TeacherFormValues>({
		resolver: zodResolver(teacherFormSchema),
		defaultValues: {
			firstName: teacher?.firstName || '',
			lastName: teacher?.lastName || '',
			middleName: teacher?.middleName || '',
			email: teacher?.email || '',
			phone: teacher?.phone || '',
			isActive: teacher?.isActive ?? true,
		},
	});

	const isActive = watch('isActive');

	const handleFormSubmit = (data: TeacherFormValues) => {
		onSubmit({
			firstName: data.firstName,
			lastName: data.lastName,
			middleName: data.middleName || undefined,
			email: data.email || undefined,
			phone: data.phone || undefined,
			isActive: data.isActive,
		});
	};

	return (
		<BaseReferenceForm
			entity={teacher}
			onSubmit={onSubmit}
			onCancel={onCancel}
			isLoading={isLoading}
			title={teacher ? 'Редактировать учителя' : 'Добавить учителя'}
			description={
				teacher
					? 'Внесите изменения в информацию об учителе'
					: 'Заполните информацию о новом учителе'
			}
			submitButtonText={teacher ? 'Обновить' : 'Создать'}
		>
			<div className="space-y-4">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{/* Фамилия */}
					<div className="space-y-2">
						<Label htmlFor="lastName">Фамилия *</Label>
						<Input
							id="lastName"
							{...register('lastName')}
							placeholder="Введите фамилию"
							className={errors.lastName ? 'border-red-500' : ''}
						/>
						{errors.lastName && (
							<p className="text-sm text-red-500">{errors.lastName.message}</p>
						)}
					</div>

					{/* Имя */}
					<div className="space-y-2">
						<Label htmlFor="firstName">Имя *</Label>
						<Input
							id="firstName"
							{...register('firstName')}
							placeholder="Введите имя"
							className={errors.firstName ? 'border-red-500' : ''}
						/>
						{errors.firstName && (
							<p className="text-sm text-red-500">{errors.firstName.message}</p>
						)}
					</div>
				</div>

				{/* Отчество */}
				<div className="space-y-2">
					<Label htmlFor="middleName">Отчество</Label>
					<Input
						id="middleName"
						{...register('middleName')}
						placeholder="Введите отчество"
						className={errors.middleName ? 'border-red-500' : ''}
					/>
					{errors.middleName && (
						<p className="text-sm text-red-500">{errors.middleName.message}</p>
					)}
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{/* Email */}
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							{...register('email')}
							placeholder="Введите email"
							className={errors.email ? 'border-red-500' : ''}
						/>
						{errors.email && (
							<p className="text-sm text-red-500">{errors.email.message}</p>
						)}
					</div>

					{/* Телефон */}
					<div className="space-y-2">
						<Label htmlFor="phone">Телефон</Label>
						<Input
							id="phone"
							{...register('phone')}
							placeholder="Введите телефон"
							className={errors.phone ? 'border-red-500' : ''}
						/>
						{errors.phone && (
							<p className="text-sm text-red-500">{errors.phone.message}</p>
						)}
					</div>
				</div>

				{/* Активный учитель */}
				<div className="flex items-center space-x-2">
					<Switch
						id="isActive"
						checked={isActive}
						onCheckedChange={checked => setValue('isActive', checked)}
					/>
					<Label htmlFor="isActive">Активный учитель</Label>
				</div>
			</div>
		</BaseReferenceForm>
	);
};

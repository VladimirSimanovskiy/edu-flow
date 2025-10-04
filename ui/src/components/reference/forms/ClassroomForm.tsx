import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BaseReferenceForm } from './BaseReferenceForm';
import type { ReferenceFormProps } from '@/types/reference-system';
import type { Classroom } from '@/types/reference';

// Схема валидации
const classroomFormSchema = z.object({
	number: z.number().int().positive('Номер кабинета должен быть положительным числом'),
	floor: z
		.number()
		.int()
		.min(1, 'Этаж должен быть не менее 1')
		.max(10, 'Этаж должен быть не более 10'),
});

type ClassroomFormValues = z.infer<typeof classroomFormSchema>;

/**
 * Форма для работы с кабинетами
 * Использует Composition Pattern - наследует структуру от BaseReferenceForm
 */
export const ClassroomForm: React.FC<ReferenceFormProps<Classroom>> = ({
	entity: classroom,
	onSubmit,
	onCancel,
	isLoading = false,
}) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ClassroomFormValues>({
		resolver: zodResolver(classroomFormSchema),
		defaultValues: {
			number: classroom?.number || 0,
			floor: classroom?.floor || 1,
		},
	});

	const handleFormSubmit = (data: ClassroomFormValues) => {
		onSubmit({
			number: data.number,
			floor: data.floor,
		});
	};

	return (
		<BaseReferenceForm
			entity={classroom}
			onSubmit={onSubmit}
			onCancel={onCancel}
			isLoading={isLoading}
			title={classroom ? 'Редактировать кабинет' : 'Добавить кабинет'}
			description={
				classroom
					? 'Внесите изменения в информацию о кабинете'
					: 'Заполните информацию о новом кабинете'
			}
			submitButtonText={classroom ? 'Обновить' : 'Создать'}
		>
			<div className="space-y-4">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{/* Номер кабинета */}
					<div className="space-y-2">
						<Label htmlFor="number">Номер кабинета *</Label>
						<Input
							id="number"
							type="number"
							{...register('number', { valueAsNumber: true })}
							placeholder="Введите номер кабинета"
							className={errors.number ? 'border-red-500' : ''}
						/>
						{errors.number && (
							<p className="text-sm text-red-500">{errors.number.message}</p>
						)}
					</div>

					{/* Этаж */}
					<div className="space-y-2">
						<Label htmlFor="floor">Этаж *</Label>
						<Input
							id="floor"
							type="number"
							{...register('floor', { valueAsNumber: true })}
							placeholder="Введите этаж"
							className={errors.floor ? 'border-red-500' : ''}
						/>
						{errors.floor && (
							<p className="text-sm text-red-500">{errors.floor.message}</p>
						)}
					</div>
				</div>
			</div>
		</BaseReferenceForm>
	);
};

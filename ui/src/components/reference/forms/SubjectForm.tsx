import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BaseReferenceForm } from './BaseReferenceForm';
import type { ReferenceFormProps } from '@/types/reference-system';
import type { Subject } from '@/types/reference';

// Схема валидации
const subjectFormSchema = z.object({
	name: z.string().min(1, 'Название предмета обязательно'),
	code: z.string().min(1, 'Код предмета обязателен'),
	description: z.string().optional(),
});

type SubjectFormValues = z.infer<typeof subjectFormSchema>;

/**
 * Форма для работы с предметами
 * Использует Composition Pattern - наследует структуру от BaseReferenceForm
 */
export const SubjectForm: React.FC<ReferenceFormProps<Subject>> = ({
	entity: subject,
	onSubmit,
	onCancel,
	isLoading = false,
}) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SubjectFormValues>({
		resolver: zodResolver(subjectFormSchema),
		defaultValues: {
			name: subject?.name || '',
			code: subject?.code || '',
			description: subject?.description || '',
		},
	});

	const handleFormSubmit = (data: SubjectFormValues) => {
		onSubmit({
			name: data.name,
			code: data.code,
			description: data.description || undefined,
		});
	};

	return (
		<BaseReferenceForm
			entity={subject}
			onSubmit={onSubmit}
			onCancel={onCancel}
			isLoading={isLoading}
			title={subject ? 'Редактировать предмет' : 'Добавить предмет'}
			description={
				subject
					? 'Внесите изменения в информацию о предмете'
					: 'Заполните информацию о новом предмете'
			}
			submitButtonText={subject ? 'Обновить' : 'Создать'}
		>
			<div className="space-y-4">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{/* Название предмета */}
					<div className="space-y-2">
						<Label htmlFor="name">Название предмета *</Label>
						<Input
							id="name"
							{...register('name')}
							placeholder="Введите название предмета"
							className={errors.name ? 'border-red-500' : ''}
						/>
						{errors.name && (
							<p className="text-sm text-red-500">{errors.name.message}</p>
						)}
					</div>

					{/* Код предмета */}
					<div className="space-y-2">
						<Label htmlFor="code">Код предмета *</Label>
						<Input
							id="code"
							{...register('code')}
							placeholder="Введите код предмета"
							className={errors.code ? 'border-red-500' : ''}
						/>
						{errors.code && (
							<p className="text-sm text-red-500">{errors.code.message}</p>
						)}
					</div>
				</div>

				{/* Описание */}
				<div className="space-y-2">
					<Label htmlFor="description">Описание</Label>
					<Input
						id="description"
						{...register('description')}
						placeholder="Введите описание предмета"
						className={errors.description ? 'border-red-500' : ''}
					/>
					{errors.description && (
						<p className="text-sm text-red-500">{errors.description.message}</p>
					)}
				</div>
			</div>
		</BaseReferenceForm>
	);
};

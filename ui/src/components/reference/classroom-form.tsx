import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormStack } from '../ui/form';
import { FormField } from '../ui/form/components/form-field/FormField';
import { Input } from '../ui/input';
import type { Classroom, ClassroomFormData } from '../../types/reference';

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

interface ClassroomFormProps {
	classroom?: Classroom;
	onSubmit: (data: ClassroomFormData) => void;
	onCancel: () => void;
	isLoading?: boolean;
}

export const ClassroomForm: React.FC<ClassroomFormProps> = ({
	classroom,
	onSubmit,
	onCancel,
	isLoading = false,
}) => {
	const form = useForm<ClassroomFormValues>({
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
		<Form asChild {...form}>
			<form className="contents" onSubmit={form.handleSubmit(handleFormSubmit)}>
				<FormStack>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<FormField
							name="number"
							title="Номер кабинета"
							description="Уникальный номер кабинета"
							required
							control={({ field }) => (
								<Input
									type="number"
									placeholder="Введите номер кабинета"
									{...field}
									onChange={e => field.onChange(parseInt(e.target.value) || 0)}
								/>
							)}
						/>

						<FormField
							name="floor"
							title="Этаж"
							description="Этаж, на котором расположен кабинет"
							required
							control={({ field }) => (
								<Input
									type="number"
									placeholder="Введите этаж"
									min="1"
									max="10"
									{...field}
									onChange={e => field.onChange(parseInt(e.target.value) || 1)}
								/>
							)}
						/>
					</div>
				</FormStack>
			</form>
		</Form>
	);
};

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormStack, FormSectionTitle, FormDivider } from '../ui/form';
import { FormField } from '../ui/form/components/form-field/FormField';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import type { Teacher, TeacherFormData } from '../../types/reference';

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

interface TeacherFormProps {
	teacher?: Teacher;
	onSubmit: (data: TeacherFormData) => void;
	onCancel: () => void;
	isLoading?: boolean;
}

export const TeacherForm: React.FC<TeacherFormProps> = ({
	teacher,
	onSubmit,
}) => {
	const form = useForm<TeacherFormValues>({
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
		<Form asChild {...form}>
			<form className="contents" onSubmit={form.handleSubmit(handleFormSubmit)}>
				<FormStack>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<FormField
							name="lastName"
							title="Фамилия"
							description="Фамилия учителя"
							required
							control={({ field }) => (
								<Input placeholder="Введите фамилию" {...field} />
							)}
						/>

						<FormField
							name="firstName"
							title="Имя"
							description="Имя учителя"
							required
							control={({ field }) => <Input placeholder="Введите имя" {...field} />}
						/>
					</div>

					<FormField
						name="middleName"
						title="Отчество"
						description="Отчество учителя (необязательно)"
						control={({ field }) => <Input placeholder="Введите отчество" {...field} />}
					/>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<FormField
							name="email"
							title="Email"
							description="Электронная почта учителя"
							control={({ field }) => (
								<Input type="email" placeholder="Введите email" {...field} />
							)}
						/>

						<FormField
							name="phone"
							title="Телефон"
							description="Номер телефона учителя"
							control={({ field }) => (
								<Input placeholder="Введите телефон" {...field} />
							)}
						/>
					</div>

					<FormDivider />

					<FormSectionTitle>Статус</FormSectionTitle>

					<FormField
						name="isActive"
						title="Активный учитель"
						description="Определяет, может ли учитель работать в системе"
						control={({ field }) => (
							<div className="flex items-center space-x-2">
								<Switch checked={field.value} onCheckedChange={field.onChange} />
								<span className="text-sm text-muted-foreground">
									Учитель активен
								</span>
							</div>
						)}
					/>
				</FormStack>
			</form>
		</Form>
	);
};

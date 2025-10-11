import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Phone } from 'lucide-react';
import { Form, FormFieldControl, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { FormField } from '@/components/ui/form/components/form-field/FormField';
import { FormStack } from '@/components/ui/form/components/form-stack/FormStack';
import { FormFooterTemplate } from '@/components/ui/form/templates/footer-template/FormFooterTemplate';
import { FormDivider } from '@/components/ui/form/components/form-divider/FormDivider';
import { FormSectionTitle } from '@/components/ui/form/components/form-section-title/FormSectionTitle';
import { ModalBody, ModalHeaderTemplate } from '@/components/ui/modal';
import { TextInput } from '@/components/ui/input';
import { SwitchField } from '@/components/ui/switch';
import type { ReferenceFormProps } from '@/types/reference-system';
import type { Teacher } from '@/types/reference';

// Схема валидации
const teacherFormSchema = z.object({
	firstName: z.string().trim(),
	lastName: z.string().trim(),
	middleName: z.string().trim().optional().or(z.literal('')),
	email: z.string().email('Некорректный email').trim().optional().or(z.literal('')),
	phone: z
		.string()
		.regex(/^[\+]?[0-9\s\-\(\)]*$/, 'Некорректный формат номера телефона')
		.trim()
		.optional()
		.or(z.literal('')),
	isActive: z.boolean(),
});

type TeacherFormValues = z.infer<typeof teacherFormSchema>;

/**
 * Форма для работы с учителями
 * Использует FormField для консистентного UI
 * Следует принципу Single Responsibility - отвечает только за поля учителя
 */
export const TeacherForm: React.FC<ReferenceFormProps<Teacher>> = ({
	entity: teacher,
	onSubmit,
	onCancel,
	isLoading = false,
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
		// Добавляем поля createdAt и updatedAt для совместимости с типом Teacher
		const teacherData = {
			firstName: data.firstName,
			lastName: data.lastName,
			middleName: data.middleName || undefined,
			email: data.email || undefined,
			phone: data.phone || undefined,
			isActive: data.isActive,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};
		onSubmit(teacherData as Omit<Teacher, 'id'>);
	};

	return (
		<Form {...form} asChild>
			<form onSubmit={form.handleSubmit(handleFormSubmit)}>
				<ModalHeaderTemplate
					title={teacher ? 'Редактировать учителя' : 'Добавить учителя'}
					description={
						teacher
							? 'Внесите изменения в информацию об учителе'
							: 'Заполните информацию о новом учителе'
					}
				/>

				<ModalBody className="flex-1 p-6 pt-0">
					<FormStack>
						<FormSectionTitle>Основная информация</FormSectionTitle>

						<FormField
							control={({ field }) => (
								<TextInput
									placeholder="Введите фамилию"
									startIcon={<User className="h-4 w-4" />}
									{...field}
								/>
							)}
							name="lastName"
							title="Фамилия"
							required
							labelClassName="w-24"
						/>

						<FormField
							control={({ field }) => (
								<TextInput
									placeholder="Введите имя"
									startIcon={<User className="h-4 w-4" />}
									{...field}
								/>
							)}
							name="firstName"
							title="Имя"
							required
							labelClassName="w-24"
						/>

						<FormField
							control={({ field }) => (
								<TextInput
									placeholder="Введите отчество"
									startIcon={<User className="h-4 w-4" />}
									{...field}
								/>
							)}
							name="middleName"
							title="Отчество"
							labelClassName="w-24"
						/>

						<FormDivider />

						<FormSectionTitle>Контактная информация</FormSectionTitle>

						<FormField
							control={({ field }) => (
								<TextInput
									type="email"
									placeholder="Введите email"
									startIcon={<Mail className="h-4 w-4" />}
									{...field}
								/>
							)}
							name="email"
							title="Email"
							labelClassName="w-24"
						/>

						<FormField
							control={({ field }) => (
								<TextInput
									type="tel"
									placeholder="Введите номер телефона"
									startIcon={<Phone className="h-4 w-4" />}
									{...field}
								/>
							)}
							name="phone"
							title="Телефон"
							labelClassName="w-24"
						/>

						<FormDivider />

						<FormSectionTitle>Настройки</FormSectionTitle>

						<FormFieldControl
							control={form.control}
							name="isActive"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<SwitchField
											id="isActive"
											label="Активен"
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</FormStack>
				</ModalBody>

				<FormFooterTemplate
					primaryButton={teacher ? 'Сохранить изменения' : 'Добавить учителя'}
					secondaryButton="Отмена"
					primaryButtonProps={{
						type: 'submit',
						disabled: isLoading,
					}}
					secondaryButtonProps={{
						type: 'button',
						onClick: onCancel,
					}}
				/>
			</form>
		</Form>
	);
};

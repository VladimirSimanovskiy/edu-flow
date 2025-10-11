import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2, Hash } from 'lucide-react';
import { Form } from '@/components/ui/form';
import { FormField } from '@/components/ui/form/components/form-field/FormField';
import { FormStack } from '@/components/ui/form/components/form-stack/FormStack';
import { FormFooterTemplate } from '@/components/ui/form/templates/footer-template/FormFooterTemplate';
import { FormSectionTitle } from '@/components/ui/form/components/form-section-title/FormSectionTitle';
import { ModalBody, ModalHeaderTemplate } from '@/components/ui/modal';
import { TextInput } from '@/components/ui/input';
import type { ReferenceFormProps } from '@/types/reference-system';
import type { Classroom } from '@/types/reference';

// Схема валидации
const classroomFormSchema = z.object({
	number: z
		.number({
			required_error: 'Номер кабинета обязателен',
			invalid_type_error: 'Номер кабинета должен быть числом',
		})
		.int('Номер кабинета должен быть целым числом')
		.positive('Номер кабинета должен быть положительным числом'),
	floor: z
		.number({
			required_error: 'Этаж обязателен',
			invalid_type_error: 'Этаж должен быть числом',
		})
		.int('Этаж должен быть целым числом')
		.positive('Этаж должен быть положительным числом'),
});

type ClassroomFormValues = z.infer<typeof classroomFormSchema>;

/**
 * Форма для работы с кабинетами
 * Использует FormField для консистентного UI
 */
export const ClassroomForm: React.FC<ReferenceFormProps<Classroom>> = ({
	entity: classroom,
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
		// Добавляем поля createdAt и updatedAt для совместимости с типом Classroom
		const classroomData = {
			...data,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};
		onSubmit(classroomData as Omit<Classroom, 'id'>);
	};

	return (
		<Form {...form} asChild>
			<form onSubmit={form.handleSubmit(handleFormSubmit)}>
				<ModalHeaderTemplate
					title={classroom ? 'Редактировать кабинет' : 'Добавить кабинет'}
					description={
						classroom
							? 'Внесите изменения в информацию о кабинете'
							: 'Заполните информацию о новом кабинете'
					}
				/>

				<ModalBody className="flex-1 p-6 pt-0">
					<FormStack>
						<FormSectionTitle>Информация о кабинете</FormSectionTitle>

						<FormField
							control={({ field }) => (
								<TextInput
									type="number"
									placeholder="Введите номер кабинета"
									startIcon={<Hash className="h-4 w-4" />}
									{...field}
									onChange={e => field.onChange(Number(e) || 0)}
								/>
							)}
							name="number"
							title="Номер кабинета"
							description="Уникальный номер кабинета"
							required
						/>

						<FormField
							control={({ field }) => (
								<TextInput
									type="number"
									placeholder="Введите этаж"
									startIcon={<Building2 className="h-4 w-4" />}
									{...field}
									onChange={e => field.onChange(Number(e) || 1)}
								/>
							)}
							name="floor"
							title="Этаж"
							description="Этаж, на котором расположен кабинет"
							required
						/>
					</FormStack>
				</ModalBody>

				<FormFooterTemplate
					primaryButton={classroom ? 'Сохранить изменения' : 'Добавить кабинет'}
					secondaryButton="Отмена"
					primaryButtonProps={{
						type: 'submit',
						disabled: isLoading,
					}}
					secondaryButtonProps={{
						type: 'button',
						onClick: onCancel,
					}}
					className="!border-0 !px-6 !py-6 !pt-0"
				/>
			</form>
		</Form>
	);
};

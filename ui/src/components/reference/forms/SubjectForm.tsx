import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BookOpen, Hash, FileText } from 'lucide-react';
import { Form } from '@/components/ui/form';
import { FormField } from '@/components/ui/form/components/form-field/FormField';
import { FormStack } from '@/components/ui/form/components/form-stack/FormStack';
import { FormFooterTemplate } from '@/components/ui/form/templates/footer-template/FormFooterTemplate';
import { FormDivider } from '@/components/ui/form/components/form-divider/FormDivider';
import { FormSectionTitle } from '@/components/ui/form/components/form-section-title/FormSectionTitle';
import { ModalBody, ModalHeaderTemplate } from '@/components/ui/modal';
import { TextInput } from '@/components/ui/input';
import type { ReferenceFormProps } from '@/types/reference-system';
import type { Subject } from '@/types/reference';

// Схема валидации
const subjectFormSchema = z.object({
	name: z.string().trim(),
	code: z
		.string()
		.trim()
		.transform(val => val.toUpperCase()),
	description: z.string().trim().optional().or(z.literal('')),
});

type SubjectFormValues = z.infer<typeof subjectFormSchema>;

/**
 * Форма для работы с предметами
 * Использует FormField для консистентного UI
 */
export const SubjectForm: React.FC<ReferenceFormProps<Subject>> = ({
	entity: subject,
	onSubmit,
	onCancel,
	isLoading = false,
}) => {
	const form = useForm<SubjectFormValues>({
		resolver: zodResolver(subjectFormSchema),
		defaultValues: {
			name: subject?.name || '',
			code: subject?.code || '',
			description: subject?.description || '',
		},
	});

	const handleFormSubmit = (data: SubjectFormValues) => {
		// Добавляем поля createdAt и updatedAt для совместимости с типом Subject
		const subjectData = {
			...data,
			description: data.description || undefined,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};
		onSubmit(subjectData as Omit<Subject, 'id'>);
	};

	return (
		<Form {...form} asChild>
			<form onSubmit={form.handleSubmit(handleFormSubmit)}>
				<ModalHeaderTemplate
					title={subject ? 'Редактировать предмет' : 'Добавить предмет'}
					description={
						subject
							? 'Внесите изменения в информацию о предмете'
							: 'Заполните информацию о новом предмете'
					}
				/>

				<ModalBody className="flex-1 p-6 pt-0">
					<FormStack>
						<FormSectionTitle>Основная информация</FormSectionTitle>

						<FormField
							control={({ field }) => (
								<TextInput
									placeholder="Введите название предмета"
									startIcon={<BookOpen className="h-4 w-4" />}
									{...field}
								/>
							)}
							name="name"
							title="Название предмета"
							description="Полное название учебного предмета"
							required
						/>

						<FormField
							control={({ field }) => (
								<TextInput
									placeholder="Введите код предмета"
									startIcon={<Hash className="h-4 w-4" />}
									{...field}
								/>
							)}
							name="code"
							title="Код предмета"
							description="Краткий код для идентификации предмета"
							required
						/>

						<FormDivider />

						<FormSectionTitle>Дополнительная информация</FormSectionTitle>

						<FormField
							control={({ field }) => (
								<TextInput
									placeholder="Введите описание предмета"
									startIcon={<FileText className="h-4 w-4" />}
									{...field}
								/>
							)}
							name="description"
							title="Описание"
							description="Дополнительное описание предмета (необязательно)"
						/>
					</FormStack>
				</ModalBody>

				<FormFooterTemplate
					primaryButton={subject ? 'Сохранить изменения' : 'Добавить предмет'}
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

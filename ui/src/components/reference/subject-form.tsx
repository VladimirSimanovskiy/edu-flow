import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormStack } from '../ui/form';
import { Button } from '../ui/button';
import { FormField } from '../ui/form/components/form-field/FormField';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import type { Subject, SubjectFormData } from '../../types/reference';

// Схема валидации
const subjectFormSchema = z.object({
	name: z.string().min(1, 'Название предмета обязательно').max(100, 'Название слишком длинное'),
	code: z.string().min(1, 'Код предмета обязателен').max(10, 'Код слишком длинный'),
	description: z.string().max(500, 'Описание слишком длинное').optional().or(z.literal('')),
});

type SubjectFormValues = z.infer<typeof subjectFormSchema>;

interface SubjectFormProps {
	subject?: Subject;
	onSubmit: (data: SubjectFormData) => void;
	onCancel: () => void;
	isLoading?: boolean;
}

export const SubjectForm: React.FC<SubjectFormProps> = ({
    subject,
    onSubmit,
    onCancel,
    isLoading,
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
		onSubmit({
			name: data.name,
			code: data.code,
			description: data.description || undefined,
		});
	};

	return (
		<Form asChild {...form}>
			<form className="contents" onSubmit={form.handleSubmit(handleFormSubmit)}>
				<FormStack>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<FormField
							name="name"
							title="Название предмета"
							description="Полное название учебного предмета"
							required
							control={({ field }) => (
								<Input placeholder="Введите название предмета" {...field} />
							)}
						/>

						<FormField
							name="code"
							title="Код предмета"
							description="Короткий код для идентификации предмета"
							required
							control={({ field }) => (
								<Input placeholder="Введите код предмета" {...field} />
							)}
						/>
					</div>

					<FormField
						name="description"
						title="Описание"
						description="Дополнительное описание предмета (необязательно)"
						control={({ field }) => (
							<Textarea placeholder="Введите описание предмета" rows={3} {...field} />
						)}
					/>
				</FormStack>
                <div className="mt-6 flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Отмена
                    </Button>
                    <Button type="submit" variant="primary" disabled={isLoading}>
                        Создать
                    </Button>
                </div>
            </form>
		</Form>
	);
};

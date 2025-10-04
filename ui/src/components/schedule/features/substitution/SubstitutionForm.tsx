import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Teacher } from '@/types/schedule';
import type { Classroom } from '@shared/types';
import {
	Form,
	FormFieldControl,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

// Схема валидации для формы замещения
const substitutionSchema = z.object({
	classroomId: z.string().min(1, {
		message: 'Выберите кабинет',
	}),
});

type SubstitutionFormData = z.infer<typeof substitutionSchema>;

interface SubstitutionFormProps {
	substituteTeacher: Teacher | undefined;
	classrooms: Classroom[];
	selectedClassroomValue: string;
	onClassroomChange: (value: string) => void;
	onSubmit: () => void;
}

export const SubstitutionForm: React.FC<SubstitutionFormProps> = ({
	substituteTeacher,
	classrooms,
	selectedClassroomValue,
	onClassroomChange,
	onSubmit,
}) => {
	// Инициализация формы с react-hook-form
	const form = useForm<SubstitutionFormData>({
		resolver: zodResolver(substitutionSchema),
		defaultValues: {
			classroomId: selectedClassroomValue,
		},
	});

	// Синхронизируем значение формы с внешним состоянием
	React.useEffect(() => {
		form.setValue('classroomId', selectedClassroomValue);
	}, [selectedClassroomValue, form]);

	const handleSubmit = (data: SubstitutionFormData) => {
		onClassroomChange(data.classroomId);
		onSubmit();
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
				<FormFieldControl
					control={form.control}
					name="classroomId"
					render={() => (
						<FormItem>
							<FormLabel>Учитель</FormLabel>
							<FormControl>
								<input
									className="w-full border rounded px-2 py-1 text-sm bg-gray-50"
									readOnly
									value={substituteTeacher ? substituteTeacher.fullName : ''}
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				<FormFieldControl
					control={form.control}
					name="classroomId"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Кабинет</FormLabel>
							<FormControl>
								<Select value={field.value} onValueChange={field.onChange}>
									<SelectTrigger>
										<SelectValue placeholder="Выберите кабинет" />
									</SelectTrigger>
									<SelectContent>
										{classrooms.map(c => (
											<SelectItem key={c.id} value={String(c.id)}>
												каб. {c.number}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
};

export default SubstitutionForm;

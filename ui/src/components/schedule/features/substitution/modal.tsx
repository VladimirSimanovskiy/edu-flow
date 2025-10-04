import React, { useEffect, useMemo, useState } from 'react';
import { apiClient } from '@/lib/api';
import { useTeacherScheduleStore } from '../highlight/store/teacher-store';
import type { Teacher } from '@/types/schedule';
import type { Classroom } from '@shared/types';
import {
	Button,
	Modal,
	ModalContent,
	ModalHeader,
	ModalTitle,
	ModalFooter,
	ModalBody,
} from '@/components/ui';
import { useQueryClient } from '@tanstack/react-query';
import { ModalDescription } from '@/components/ui/modal';
import SubstitutionForm from '@/components/schedule/features/substitution/SubstitutionForm';

interface CreateSubstitutionModalProps {
	open: boolean;
	onClose: () => void;
	teachers: Teacher[];
	substituteTeacherId: number;
}

export const CreateSubstitutionModal: React.FC<CreateSubstitutionModalProps> = ({
	open,
	onClose,
	teachers,
	substituteTeacherId,
}) => {
	const { highlight, exitSubstitutionMode } = useTeacherScheduleStore();
	const [classrooms, setClassrooms] = useState<Classroom[]>([]);
	const [selectedClassroomValue, setSelectedClassroomValue] = useState<string>('');
	const [saving, setSaving] = useState(false);
	const queryClient = useQueryClient();

	const mode = highlight.substitutionMode;

	const substituteTeacher = useMemo(
		() => teachers.find(t => t.id === substituteTeacherId),
		[teachers, substituteTeacherId]
	);

	useEffect(() => {
		const fetchClassrooms = async () => {
			if (!mode) return;
			const free = await apiClient.getAvailableClassrooms(
				mode.date,
				mode.lessonNumber,
				mode.idOriginalLesson
			);
			setClassrooms(free);
			if (free.length > 0) setSelectedClassroomValue(String(free[0].id));
			else setSelectedClassroomValue('');
		};
		if (open) {
			fetchClassrooms();
		} else {
			// reset state when closing
			setSelectedClassroomValue('');
			setClassrooms([]);
		}
	}, [open, mode]);

	const onSave = async () => {
		if (!mode || !selectedClassroomValue || !substituteTeacherId) return;
		try {
			setSaving(true);
			await apiClient.createSubstitution({
				date: mode.date,
				idLesson: mode.idOriginalLesson,
				idTeacher: substituteTeacherId,
				idClassroom: Number(selectedClassroomValue),
			});
			// Refresh lessons data (day/week) after mutation
			await queryClient.invalidateQueries({ queryKey: ['lessons'] });
			exitSubstitutionMode();
			onClose();
		} finally {
			setSaving(false);
		}
	};

	return (
		<Modal open={open} onOpenChange={o => !o && onClose()}>
			<ModalContent>
				<ModalHeader>
					<ModalTitle>Создание замещения</ModalTitle>
					<ModalDescription className="sr-only">
						Форма создания замещения для выбранного урока
					</ModalDescription>
				</ModalHeader>
				<ModalBody>
					<SubstitutionForm
						substituteTeacher={substituteTeacher}
						classrooms={classrooms}
						selectedClassroomValue={selectedClassroomValue}
						onClassroomChange={setSelectedClassroomValue}
						onSubmit={onSave}
					/>
				</ModalBody>
				<ModalFooter>
					<Button variant="secondary" onClick={onClose} disabled={saving}>
						Отмена
					</Button>
					<Button onClick={onSave} disabled={saving || !selectedClassroomValue}>
						Сохранить
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default CreateSubstitutionModal;

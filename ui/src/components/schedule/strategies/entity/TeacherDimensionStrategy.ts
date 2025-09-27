import type { EntityDimensionStrategy, EntityRow } from '../../core/types';
import type { Teacher, Lesson } from '../../../../types/schedule';

export class TeacherDimensionStrategy implements EntityDimensionStrategy {
	private isVisible: (id: number) => boolean;

	constructor(isVisible: (id: number) => boolean) {
		this.isVisible = isVisible;
	}

	getRows(input: { teachers?: Teacher[] }): EntityRow[] {
		const teachers = input.teachers || [];
		const shorten = (fullName?: string): string => {
			if (!fullName) return '';
			const parts = fullName.trim().split(' ').filter(Boolean);
			// Ожидаем формат: Имя Фамилия Отчество
			if (parts.length < 2) return fullName;
			const first = parts[0];
			const last = parts[1];
			const middle = parts[2] || '';
			const firstInitial = first.charAt(0).toUpperCase();
			const middleInitial = middle ? middle.charAt(0).toUpperCase() : '';
			return `${last} ${firstInitial}${middleInitial ? '.' + middleInitial : ''}.`;
		};
		return teachers.map(t => ({
			id: t.id,
			label: shorten((t as any).fullName ?? (t as any).name) || String(t.id),
		}));
	}

	getRowIdForLesson(lesson: Lesson): number {
		return (lesson as any).idTeacher ?? (lesson as any).teacherId;
	}

	isRowVisible(rowId: number): boolean {
		return this.isVisible(rowId);
	}
}

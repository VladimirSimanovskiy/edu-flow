import type { EntityDimensionStrategy, EntityRow } from '../../core/types';
import type { Class, Lesson } from '../../../../types/schedule';

export class ClassDimensionStrategy implements EntityDimensionStrategy {
	private isVisible: (id: number) => boolean;

	constructor(isVisible: (id: number) => boolean) {
		this.isVisible = isVisible;
	}

	getRows(input: { classes?: Class[] }): EntityRow[] {
		const classes = input.classes || [];
		return classes.map(c => ({
			id: c.id,
			label: (c as any).name ?? `${(c as any).grade}${(c as any).letter}`,
		}));
	}

	getRowIdForLesson(lesson: Lesson): number {
		return (lesson as any).idClass ?? (lesson as any).classId;
	}

	isRowVisible(rowId: number): boolean {
		return this.isVisible(rowId);
	}
}

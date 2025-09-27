import type { Lesson } from '@/types/schedule';

// Time view
export interface TimeColumn {
	key: string;
	label: string;
	groupKey?: string;
	groupLabel?: string;
}

export interface TimeViewStrategy {
	getColumns(input: { date: Date }): TimeColumn[];
	getCellKey(lesson: Lesson): string;
	getPrefetchRanges(date: Date): Array<{ start: Date; end: Date }>;
}

// Entity dimension
export interface EntityRow {
	id: number;
	label: string;
}

export interface EntityDimensionStrategy {
	getRows(input: { teachers?: any[]; classes?: any[] }): EntityRow[];
	getRowIdForLesson(lesson: Lesson): number;
	isRowVisible(rowId: number): boolean;
}

// Grid
export interface GridCell {
	rowId: number;
	columnKey: string;
	lessons: Lesson[];
}

export interface GridModel {
	rows: EntityRow[];
	columns: TimeColumn[];
	cells: GridCell[];
}

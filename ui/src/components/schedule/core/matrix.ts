import type { Lesson } from '@/types/schedule';
import type {
	TimeViewStrategy,
	EntityDimensionStrategy,
	GridCell,
	GridModel,
	EntityRow,
} from './types';

export function buildLessonMatrix(params: {
	lessons: Lesson[];
	date: Date;
	timeView: TimeViewStrategy;
	entity: EntityDimensionStrategy;
	entities: { teachers?: any[]; classes?: any[] };
}): GridModel {
	const { lessons, date, timeView, entity, entities } = params;
	const columns = timeView.getColumns({ date });
	const rows: EntityRow[] = entity.getRows(entities);
	const visibleRows = rows.filter(r => entity.isRowVisible(r.id));

	const cellMap = new Map<string, GridCell>();
	for (const row of visibleRows) {
		for (const col of columns) {
			const key = `${row.id}::${col.key}`;
			cellMap.set(key, { rowId: row.id, columnKey: col.key, lessons: [] });
		}
	}

	for (const lesson of lessons) {
		const rowId = entity.getRowIdForLesson(lesson);
		if (!entity.isRowVisible(rowId)) continue;
		const columnKey = timeView.getCellKey(lesson);
		const key = `${rowId}::${columnKey}`;
		const cell = cellMap.get(key);
		if (cell) {
			cell.lessons.push(lesson);
		}
	}

	return {
		rows: visibleRows,
		columns,
		cells: Array.from(cellMap.values()),
	};
}

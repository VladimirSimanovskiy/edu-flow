import React from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import type { ReferenceEntity } from '@/types/reference-system';
import { DataTable } from '../ui/data-table';
import { createEditColumn } from '../ui/data-table/components/EditColumn';

interface ReferenceTableProps<T extends ReferenceEntity> {
	data: T[];
	isLoading?: boolean;
	onEdit: (item: T) => void;
	onView?: (item: T) => void;
	columns: ColumnDef<T, any>[];
	entityType?: string;
	rowSelection?: Record<string, boolean>;
	onRowSelectionChange?: (selection: Record<string, boolean>) => void;
}

export const ReferenceTable = <T extends ReferenceEntity>({
	data,
	isLoading,
	onEdit,
	columns: inputColumns,
	rowSelection = {},
	onRowSelectionChange,
}: ReferenceTableProps<T>) => {
	const columns = React.useMemo<ColumnDef<T, any>[]>(() => {
		const leading = [createEditColumn<T>(onEdit)];
		return [...leading, ...inputColumns];
	}, [inputColumns, onEdit]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-32">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	return (
		<DataTable<T, any>
			columns={columns}
			enableRowSelection={true}
			data={Array.isArray(data) ? data : []}
			rowSelection={rowSelection}
			onRowSelectionChange={updater => {
				if (onRowSelectionChange) {
					const newSelection =
						typeof updater === 'function' ? updater(rowSelection) : updater;
					onRowSelectionChange(newSelection);
				}
			}}
			getRowId={(row, index) => String((row as any).id ?? index)}
		/>
	);
};

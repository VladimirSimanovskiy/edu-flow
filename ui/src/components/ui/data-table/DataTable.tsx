import * as React from 'react';
import type { ColumnDef, OnChangeFn, RowSelectionState } from '@tanstack/react-table';
import { useDataTable } from './hooks/useDataTable';
import { DataTableBase } from './components/DataTableBase';
import { createSelectionColumn } from './components/SelectionColumn';

export interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	enableRowSelection?: boolean;
	pageSize?: number;
	className?: string;
	rowSelection?: RowSelectionState;
	onRowSelectionChange?: OnChangeFn<RowSelectionState>;
	getRowId?: (original: TData, index: number, parent?: any) => string;
}

export function DataTable<TData, TValue>({
	columns: inputColumns,
	data,
	enableRowSelection = false,
	pageSize = 10,
	className,
	rowSelection,
	onRowSelectionChange,
	getRowId,
}: DataTableProps<TData, TValue>) {
	const columns = React.useMemo(() => {
		if (!enableRowSelection) return inputColumns;
		return [createSelectionColumn<TData, TValue>(), ...inputColumns] as ColumnDef<
			TData,
			TValue
		>[];
	}, [enableRowSelection, inputColumns]);

	const { table } = useDataTable<TData, TValue>({
		columns,
		data,
		pageSize,
		rowSelection,
		onRowSelectionChange,
		getRowId,
	});

	return <DataTableBase<TData> table={table} className={className} />;
}

export default DataTable;

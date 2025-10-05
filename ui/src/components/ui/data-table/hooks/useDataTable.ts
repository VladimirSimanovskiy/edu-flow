import * as React from 'react';
import type {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	Table as TanStackTable,
	RowSelectionState,
	OnChangeFn,
} from '@tanstack/react-table';
import {
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';

export interface UseDataTableOptions<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	pageSize?: number;
	rowSelection?: RowSelectionState;
	onRowSelectionChange?: OnChangeFn<RowSelectionState>;
	getRowId?: (originalRow: TData, index: number, parent?: any) => string;
}

export interface UseDataTableResult<TData> {
	table: TanStackTable<TData>;
	sorting: SortingState;
	setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
	columnFilters: ColumnFiltersState;
	setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
	columnVisibility: VisibilityState;
	setColumnVisibility: React.Dispatch<React.SetStateAction<VisibilityState>>;
	rowSelection: RowSelectionState;
	setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>>;
}

export function useDataTable<TData, TValue>({
	columns,
	data,
	pageSize = 10,
	rowSelection: controlledRowSelection,
	onRowSelectionChange,
	getRowId,
}: UseDataTableOptions<TData, TValue>): UseDataTableResult<TData> {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
	const [uncontrolledRowSelection, setUncontrolledRowSelection] =
		React.useState<RowSelectionState>({});

	const rowSelection = controlledRowSelection ?? uncontrolledRowSelection;

	const handleRowSelectionChange = React.useCallback<OnChangeFn<RowSelectionState>>(
		updaterOrValue => {
			if (onRowSelectionChange) {
				onRowSelectionChange(updaterOrValue);
				return;
			}
			setUncontrolledRowSelection(prev =>
				typeof updaterOrValue === 'function'
					? (updaterOrValue as (old: RowSelectionState) => RowSelectionState)(prev)
					: updaterOrValue
			);
		},
		[onRowSelectionChange]
	);

	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: handleRowSelectionChange,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
		initialState: {
			pagination: {
				pageSize,
			},
		},
		getRowId,
	});

	return {
		table,
		sorting,
		setSorting,
		columnFilters,
		setColumnFilters,
		columnVisibility,
		setColumnVisibility,
		rowSelection,
		setRowSelection: setUncontrolledRowSelection,
	};
}

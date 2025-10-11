import React from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Badge } from '../ui/badge';
import type { Teacher, Classroom, Subject } from '../../types/reference';
import type { ReferenceEntity } from '@/types/reference-system';
import { DataTable } from '../ui/data-table';
import { createEditColumn } from '../ui/data-table/components/EditColumn';

interface ReferenceTableProps<T extends ReferenceEntity> {
	data: T[];
	isLoading?: boolean;
	onEdit: (item: T) => void;
	onDelete: (id: number) => void;
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
	onDelete,
	onView,
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

// Предустановленные конфигурации колонок для каждого типа справочника
export const teacherColumns: ColumnDef<Teacher, any>[] = [
	{
		accessorKey: 'lastName',
		header: 'Фамилия',
	},
	{
		accessorKey: 'firstName',
		header: 'Имя',
	},
	{
		accessorKey: 'middleName',
		header: 'Отчество',
	},
	{
		accessorKey: 'email',
		header: 'Email',
	},
	{
		accessorKey: 'phone',
		header: 'Телефон',
	},
	{
		accessorKey: 'isActive',
		header: 'Статус',
		cell: ({ row }) => (
			<Badge status={row.original.isActive ? 'success' : 'error'}>
				{row.original.isActive ? 'Активен' : 'Неактивен'}
			</Badge>
		),
	},
];

export const classroomColumns: ColumnDef<Classroom, any>[] = [
	{
		accessorKey: 'number',
		header: 'Номер',
	},
	{
		accessorKey: 'floor',
		header: 'Этаж',
	},
];

export const subjectColumns: ColumnDef<Subject, any>[] = [
	{
		accessorKey: 'name',
		header: 'Название',
	},
	{
		accessorKey: 'code',
		header: 'Код',
	},
	{
		accessorKey: 'description',
		header: 'Описание',
	},
];

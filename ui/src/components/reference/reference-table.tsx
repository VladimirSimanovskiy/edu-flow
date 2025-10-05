import React from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '../ui/dropdown';
import type { Teacher, Classroom, Subject } from '../../types/reference';
import type { ReferenceEntity } from '@/types/reference-system';
import { DataTable } from '@/components/ui/data-table';

interface ReferenceTableProps<T extends ReferenceEntity> {
	data: T[];
	isLoading?: boolean;
	onEdit: (item: T) => void;
	onDelete: (id: number) => void;
	onView?: (item: T) => void;
	columns: ColumnDef<T, any>[];
	entityType?: string;
}

export const ReferenceTable = <T extends ReferenceEntity>({
	data,
	isLoading,
	onEdit,
	onDelete,
	onView,
	columns: inputColumns,
}: ReferenceTableProps<T>) => {
	const actionColumn: ColumnDef<T> = {
		id: 'actions',
		header: '',
		enableSorting: false,
		enableHiding: false,
		cell: ({ row }) => {
			const item = row.original as T;
			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="sm">
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						{onView && (
							<DropdownMenuItem onClick={() => onView(item)}>
								<Eye className="mr-2 h-4 w-4" />
								Просмотр
							</DropdownMenuItem>
						)}
						<DropdownMenuItem onClick={() => onEdit(item)}>
							<Edit className="mr-2 h-4 w-4" />
							Редактировать
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => onDelete(item.id)}
							className="text-red-600 focus:text-red-600"
						>
							<Trash2 className="mr-2 h-4 w-4" />
							Удалить
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	};

	const columns = React.useMemo<ColumnDef<T, any>[]>(() => {
		return [...inputColumns, actionColumn];
	}, [inputColumns]);

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

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
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

interface ReferenceTableProps<T extends Teacher | Classroom | Subject> {
	data: T[];
	isLoading?: boolean;
	onEdit: (item: T) => void;
	onDelete: (id: number) => void;
	onView?: (item: T) => void;
	columns: ColumnConfig<T>[];
	entityType: 'teachers' | 'classrooms' | 'subjects';
}

interface ColumnConfig<T> {
	key: keyof T;
	label: string;
	render?: (value: any, item: T) => React.ReactNode;
	sortable?: boolean;
}

export const ReferenceTable = <T extends Teacher | Classroom | Subject>({
	data,
	isLoading,
	onEdit,
	onDelete,
	onView,
	columns,
}: ReferenceTableProps<T>) => {
	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-32">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	if (!data || !Array.isArray(data) || data.length === 0) {
		return (
			<div className="text-center py-8 text-gray-500">
				<p>Нет данных для отображения</p>
			</div>
		);
	}

	return (
		<div className="border rounded-lg overflow-hidden">
			<Table>
				<TableHeader>
					<TableRow>
						{columns.map(column => (
							<TableHead key={String(column.key)} className="font-medium">
								{column.label}
							</TableHead>
						))}
						<TableHead className="w-12"></TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.map(item => (
						<TableRow key={item.id} className="hover:bg-gray-50">
							{columns.map(column => (
								<TableCell key={String(column.key)}>
									{column.render
										? column.render(item[column.key], item)
										: String(item[column.key] || '')}
								</TableCell>
							))}
							<TableCell>
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
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

// Предустановленные конфигурации колонок для каждого типа справочника
export const teacherColumns: ColumnConfig<Teacher>[] = [
	{
		key: 'lastName',
		label: 'Фамилия',
		sortable: true,
	},
	{
		key: 'firstName',
		label: 'Имя',
		sortable: true,
	},
	{
		key: 'middleName',
		label: 'Отчество',
	},
	{
		key: 'email',
		label: 'Email',
	},
	{
		key: 'phone',
		label: 'Телефон',
	},
	{
		key: 'isActive',
		label: 'Статус',
		render: (value: boolean) => (
			<Badge status={value ? 'success' : 'error'}>{value ? 'Активен' : 'Неактивен'}</Badge>
		),
	},
];

export const classroomColumns: ColumnConfig<Classroom>[] = [
	{
		key: 'number',
		label: 'Номер',
		sortable: true,
	},
	{
		key: 'floor',
		label: 'Этаж',
		sortable: true,
	},
];

export const subjectColumns: ColumnConfig<Subject>[] = [
	{
		key: 'name',
		label: 'Название',
		sortable: true,
	},
	{
		key: 'code',
		label: 'Код',
		sortable: true,
	},
	{
		key: 'description',
		label: 'Описание',
	},
];

import type { ColumnDef } from '@tanstack/react-table';
import { Badge } from '../../ui/badge';
import type { Teacher } from '@/types/reference';

/**
 * Конфигурация колонок таблицы для справочника учителей
 * Следует принципу Single Responsibility - отвечает только за конфигурацию таблицы
 */
export const teacherTableColumns: ColumnDef<Teacher, string>[] = [
	{
		accessorKey: 'lastName',
		header: 'Фамилия',
		cell: ({ row }) => <div className="font-medium">{row.getValue('lastName')}</div>,
	},
	{
		accessorKey: 'firstName',
		header: 'Имя',
		cell: ({ row }) => <div className="font-medium">{row.getValue('firstName')}</div>,
	},
	{
		accessorKey: 'middleName',
		header: 'Отчество',
		cell: ({ row }) => <div className="font-medium">{row.getValue('middleName')}</div>,
	},
	{
		accessorKey: 'email',
		header: 'Email',
		cell: ({ row }) => (
			<div className="text-blue-600 hover:text-blue-800">{row.getValue('email')}</div>
		),
	},
	{
		accessorKey: 'phone',
		header: 'Телефон',
		cell: ({ row }) => <div className="font-mono text-sm">{row.getValue('phone')}</div>,
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

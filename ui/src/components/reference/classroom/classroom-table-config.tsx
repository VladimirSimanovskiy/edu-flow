import type { ColumnDef } from '@tanstack/react-table';
import type { Classroom } from '@/types/reference';

/**
 * Конфигурация колонок таблицы для справочника кабинетов
 * Следует принципу Single Responsibility - отвечает только за конфигурацию таблицы
 */
export const classroomTableColumns: ColumnDef<Classroom, string>[] = [
	{
		accessorKey: 'number',
		header: 'Номер',
		cell: ({ row }) => <div className="font-medium text-lg">{row.getValue('number')}</div>,
	},
	{
		accessorKey: 'floor',
		header: 'Этаж',
		cell: ({ row }) => <div className="text-gray-600">{row.getValue('floor')} этаж</div>,
	},
];

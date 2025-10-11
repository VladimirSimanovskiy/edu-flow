import type { ColumnDef } from '@tanstack/react-table';
import type { Subject } from '@/types/reference';

/**
 * Конфигурация колонок таблицы для справочника предметов
 * Следует принципу Single Responsibility - отвечает только за конфигурацию таблицы
 */
export const subjectTableColumns: ColumnDef<Subject, string>[] = [
	{
		accessorKey: 'name',
		header: 'Название',
		cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
	},
	{
		accessorKey: 'code',
		header: 'Код',
		cell: ({ row }) => (
			<div className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
				{row.getValue('code')}
			</div>
		),
	},
	{
		accessorKey: 'description',
		header: 'Описание',
		cell: ({ row }) => {
			const description = row.getValue('description') as string;
			return (
				<div className="max-w-xs truncate text-gray-600" title={description}>
					{description || '—'}
				</div>
			);
		},
	},
];

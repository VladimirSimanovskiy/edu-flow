import type { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

export function createEditColumn<T>(onEdit: (item: T) => void): ColumnDef<T> {
	return {
		id: 'edit',
		header: '',
		enableSorting: false,
		enableHiding: false,
		cell: ({ row }) => (
			<Button
				variant="ghost"
				size="sm"
				aria-label="Edit row"
				onClick={() => onEdit(row.original as T)}
			>
				<Edit className="h-4 w-4" />
			</Button>
		),
	};
}



import React from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Search, X } from 'lucide-react';
import type { ReferenceFilters as ReferenceFiltersType } from '../../types/reference';

interface ReferenceFiltersProps {
	filters: ReferenceFiltersType;
	onFiltersChange: (filters: Partial<ReferenceFiltersType>) => void;
	onReset: () => void;
	sortOptions: { value: string; label: string }[];
	entityType: 'teachers' | 'classrooms' | 'subjects';
}

export const ReferenceFilters: React.FC<ReferenceFiltersProps> = ({
	filters,
	onFiltersChange,
	onReset,
	sortOptions,
	entityType,
}) => {
	const handleSearchChange = (value: string) => {
		onFiltersChange({ search: value, page: 1 });
	};

	const handleSortChange = (value: string) => {
		onFiltersChange({ sortBy: value, page: 1 });
	};

	const handleSortOrderChange = (value: string) => {
		onFiltersChange({ sortOrder: value as 'asc' | 'desc', page: 1 });
	};

	const handleLimitChange = (value: number) => {
		onFiltersChange({ limit: value, page: 1 });
	};

	const getSearchPlaceholder = () => {
		switch (entityType) {
			case 'teachers':
				return 'Поиск по имени, фамилии, email...';
			case 'classrooms':
				return 'Поиск по номеру кабинета...';
			case 'subjects':
				return 'Поиск по названию, коду...';
			default:
				return 'Поиск...';
		}
	};

	const hasActiveFilters = filters.search || filters.sortBy || filters.limit !== 10;

	return (
		<div className="bg-white p-4 border rounded-lg shadow-sm">
			<div className="flex flex-col sm:flex-row gap-4">
				{/* Поиск */}
				<div className="flex-1">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
						<Input
							placeholder={getSearchPlaceholder()}
							value={filters.search || ''}
							onChange={e => handleSearchChange(e.target.value)}
							className="pl-10"
						/>
					</div>
				</div>

				{/* Сортировка */}
				<div className="flex gap-2">
					<Select value={filters.sortBy || ''} onValueChange={handleSortChange}>
						<SelectTrigger>
							<SelectValue placeholder="Сортировка" />
						</SelectTrigger>
						<SelectContent>
							{sortOptions.map(option => (
								<SelectItem key={option.value} value={option.value}>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Select
						value={filters.sortOrder || 'asc'}
						onValueChange={handleSortOrderChange}
					>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="asc">По возрастанию</SelectItem>
							<SelectItem value="desc">По убыванию</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Количество на странице */}
				<Select
					value={String(filters.limit || 10)}
					onValueChange={value => handleLimitChange(Number(value))}
				>
					<SelectTrigger>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="10">10</SelectItem>
						<SelectItem value="25">25</SelectItem>
						<SelectItem value="50">50</SelectItem>
						<SelectItem value="100">100</SelectItem>
					</SelectContent>
				</Select>

				{/* Сброс фильтров */}
				{hasActiveFilters && (
					<Button variant="outline" onClick={onReset} size="sm">
						<X className="h-4 w-4 mr-2" />
						Сбросить
					</Button>
				)}
			</div>
		</div>
	);
};

import type { ReferenceFiltersProps } from '@/types/reference-system';
import type { ReferenceEntity } from '@/types/reference-system';

/**
 * Универсальные фильтры для справочников
 */
export const ReferenceFilters = <T extends ReferenceEntity>({
	filters,
	onFiltersChange,
	onReset,
	sortOptions,
}: ReferenceFiltersProps<T>) => {
	return (
		<div className="space-y-4 p-4 bg-gray-50 rounded-lg">
			<div className="flex items-center justify-between">
				<h3 className="text-lg font-medium">Фильтры</h3>
				<button onClick={onReset} className="text-sm text-blue-600 hover:text-blue-800">
					Сбросить
				</button>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{/* Поиск */}
				<div>
					<label className="block text-sm font-medium mb-1">Поиск</label>
					<input
						type="text"
						value={filters.search || ''}
						onChange={e => onFiltersChange({ ...filters, search: e.target.value })}
						className="w-full border rounded px-3 py-2"
						placeholder="Введите поисковый запрос"
					/>
				</div>

				{/* Сортировка */}
				<div>
					<label className="block text-sm font-medium mb-1">Сортировка</label>
					<select
						value={filters.sortBy || ''}
						onChange={e => onFiltersChange({ ...filters, sortBy: e.target.value })}
						className="w-full border rounded px-3 py-2"
					>
						<option value="">Выберите поле</option>
						{sortOptions.map(option => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				</div>

				{/* Порядок сортировки */}
				<div>
					<label className="block text-sm font-medium mb-1">Порядок</label>
					<select
						value={filters.sortOrder || 'asc'}
						onChange={e =>
							onFiltersChange({
								...filters,
								sortOrder: e.target.value as 'asc' | 'desc',
							})
						}
						className="w-full border rounded px-3 py-2"
					>
						<option value="asc">По возрастанию</option>
						<option value="desc">По убыванию</option>
					</select>
				</div>
			</div>
		</div>
	);
};

import { useRef, useEffect } from 'react';
import { Checkbox } from '../checkbox';
import { Loader2 } from 'lucide-react';
import type { CheckboxListProps } from '../../../types/valuesFilter';

export const CheckboxList = <T extends string | number>({
	items,
	toggledItems,
	allChecked,
	inProgress,
	fullLoaded,
	valueView,
	selectAllText,
	loadingText,
	onToggleAll,
	onToggleItem,
	onLoadMore,
	isChecked,
}: CheckboxListProps<T>) => {
	const sentinelRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	// Intersection Observer for infinite scroll
	useEffect(() => {
		const sentinel = sentinelRef.current;
		if (!sentinel || fullLoaded || inProgress) return;

		const observer = new IntersectionObserver(
			entries => {
				const [entry] = entries;
				if (entry.isIntersecting) {
					onLoadMore();
				}
			},
			{
				root: containerRef.current,
				rootMargin: '100px',
				threshold: 0.1,
			}
		);

		observer.observe(sentinel);

		return () => {
			observer.disconnect();
		};
	}, [fullLoaded, inProgress, onLoadMore]);

	const getSelectAllState = () => {
		if (allChecked) {
			// Когда allChecked = true, "Выбрать все" должно быть checked
			// если нет исключений (toggledItems пустой)
			if (toggledItems.length === 0) return 'checked';
			// если есть исключения, то indeterminate
			return 'indeterminate';
		} else {
			// Когда allChecked = false, "Выбрать все" должно быть unchecked
			// если нет выбранных элементов
			if (toggledItems.length === 0) return 'unchecked';
			// если есть выбранные элементы, то indeterminate
			return 'indeterminate';
		}
	};

	const selectAllState = getSelectAllState();

	return (
		<div
			ref={containerRef}
			className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
		>
			<div className="space-y-2">
				{/* Select All Checkbox */}
				<div className="flex items-center space-x-2 p-2 border-b">
					<Checkbox
						id="select-all"
						checked={
							selectAllState === 'checked'
								? true
								: selectAllState === 'indeterminate'
									? 'indeterminate'
									: false
						}
						onCheckedChange={onToggleAll}
					/>
					<label
						htmlFor="select-all"
						className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
					>
						{selectAllText}
					</label>
				</div>

				{/* Items List */}
				<div className="space-y-1">
					{items.map((item, index) => (
						<div
							key={`${item}-${index}`}
							className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded"
						>
							<Checkbox
								id={`item-${item}`}
								checked={isChecked(item)}
								onCheckedChange={() => onToggleItem(item)}
							/>
							<label
								htmlFor={`item-${item}`}
								className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
							>
								{valueView(item)}
							</label>
						</div>
					))}
				</div>

				{/* Loading More Indicator */}
				{inProgress && !fullLoaded && (
					<div className="flex items-center justify-center p-4">
						<Loader2 className="h-4 w-4 animate-spin mr-2" />
						<span className="text-sm text-muted-foreground">{loadingText}</span>
					</div>
				)}

				{/* Sentinel for infinite scroll */}
				<div ref={sentinelRef} className="h-1" />
			</div>
		</div>
	);
};

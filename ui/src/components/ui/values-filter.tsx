import { useState, useEffect, useCallback } from 'react';
import { SearchInput } from './search-input';
import { CheckboxList } from './checkbox-list';
import { cn } from '../../utils/cn';
import type { ValuesFilterOptions, CheckboxListState, ItemValue } from '../../types/valuesFilter';

export interface ValuesFilterProps<T extends ItemValue> {
	options: ValuesFilterOptions<T>;
	className?: string;
}

export const ValuesFilter = <T extends ItemValue>({ options, className }: ValuesFilterProps<T>) => {
	// Initialize state with correct values from initState if available
	const [state, setState] = useState<CheckboxListState<T>>(() => {
		if (options.initState) {
			return {
				items: [],
				toggledItems: options.initState.itemsList,
				allChecked: !options.initState.inList,
				page: 1,
				fullLoaded: false,
				inProgress: false,
				searchQuery: '',
			};
		}
		return {
			items: [],
			toggledItems: [],
			allChecked: true,
			page: 1,
			fullLoaded: false,
			inProgress: false,
			searchQuery: '',
		};
	});

	const [filterTimer, setFilterTimer] = useState<NodeJS.Timeout | null>(null);
	const [isInitialized, setIsInitialized] = useState(false);
	const [isInitializing, setIsInitializing] = useState(false);
	const [lastTriggeredState, setLastTriggeredState] = useState<{
		allChecked: boolean;
		toggledItems: T[];
	} | null>(null);

	// Initialize state from options (only once)
	useEffect(() => {
		if (options.initState && !isInitialized) {
			setIsInitializing(true);
			// Only update if state is different from initState
			setState(prev => {
				const newAllChecked = !options.initState!.inList;
				const newToggledItems = options.initState!.itemsList;

				// Check if state is already correct
				if (
					prev.allChecked === newAllChecked &&
					prev.toggledItems.length === newToggledItems.length &&
					prev.toggledItems.every((item, index) => item === newToggledItems[index])
				) {
					setIsInitialized(true);
					setTimeout(() => setIsInitializing(false), 0);
					return prev; // No change needed
				}

				return {
					...prev,
					allChecked: newAllChecked,
					toggledItems: newToggledItems,
				};
			});
			setIsInitialized(true);
			// Reset initializing flag after state update
			setTimeout(() => setIsInitializing(false), 0);
		}
	}, [options.initState, isInitialized]);

	// Load data function
	const loadData = useCallback(
		async (page: number, searchQuery: string = '') => {
			setState(prev => ({ ...prev, inProgress: true }));

			try {
				const data = await options.fetchData(page, searchQuery);
				setState(prev => ({
					...prev,
					items: page === 1 ? data.values : [...prev.items, ...data.values],
					fullLoaded: data.fullLoaded,
					page,
					inProgress: false,
				}));
			} catch (error) {
				console.error('Error loading data:', error);
				setState(prev => ({ ...prev, inProgress: false }));
			}
		},
		[options.fetchData]
	);

	// Initial load
	useEffect(() => {
		loadData(1, state.searchQuery);
	}, [loadData, state.searchQuery]);

	// Handle search
	const handleSearch = useCallback((searchQuery: string) => {
		setState(prev => ({ ...prev, searchQuery, page: 1, items: [] }));
	}, []);

	// Handle toggle all
	const handleToggleAll = useCallback(() => {
		setState(prev => {
			const newAllChecked = !prev.allChecked;
			return {
				...prev,
				allChecked: newAllChecked,
				toggledItems: [], // Очищаем список исключений/выбранных элементов
			};
		});
	}, []);

	// Handle toggle item
	const handleToggleItem = useCallback((item: T) => {
		setState(prev => {
			const newToggledItems = prev.toggledItems.includes(item)
				? prev.toggledItems.filter(v => v !== item)
				: [...prev.toggledItems, item];

			return { ...prev, toggledItems: newToggledItems };
		});
	}, []);

	// Handle load more
	const handleLoadMore = useCallback(() => {
		if (!state.fullLoaded && !state.inProgress) {
			loadData(state.page + 1, state.searchQuery);
		}
	}, [loadData, state.page, state.searchQuery, state.fullLoaded, state.inProgress]);

	// Check if item is checked
	const isChecked = useCallback(
		(item: T) => {
			if (state.allChecked) {
				return !state.toggledItems.includes(item);
			} else {
				return state.toggledItems.includes(item);
			}
		},
		[state.allChecked, state.toggledItems]
	);

	// Trigger filter change with debounce
	const triggerFilterChange = useCallback(
		(inList: boolean, items: T[]) => {
			if (filterTimer) {
				clearTimeout(filterTimer);
			}

			const timer = setTimeout(() => {
				options.onFilterChanged(inList, items);
			}, 300);

			setFilterTimer(timer);
		},
		[options.onFilterChanged, filterTimer]
	);

	// Trigger filter change when state changes (but not during initialization)
	useEffect(() => {
		// Don't trigger filter change during initialization
		if (isInitializing) return;

		const items = Array.from(state.toggledItems);

		// Check if state has actually changed
		const currentState = { allChecked: state.allChecked, toggledItems: items };
		if (
			lastTriggeredState &&
			lastTriggeredState.allChecked === currentState.allChecked &&
			lastTriggeredState.toggledItems.length === currentState.toggledItems.length &&
			lastTriggeredState.toggledItems.every(
				(item, index) => item === currentState.toggledItems[index]
			)
		) {
			return; // State hasn't changed, don't trigger
		}

		setLastTriggeredState(currentState);

		if (state.allChecked) {
			// When allChecked = true:
			// - If toggledItems.length > 0: hide selected items (inList = false, items = toggledItems)
			// - If toggledItems.length = 0: show all items (inList = false, items = [])
			triggerFilterChange(false, items);
		} else {
			// When allChecked = false:
			// - If toggledItems.length > 0: show only selected items (inList = true, items = toggledItems)
			// - If toggledItems.length = 0: hide all items (inList = false, items = [])
			if (state.toggledItems.length) {
				triggerFilterChange(true, items);
			} else {
				triggerFilterChange(false, []);
			}
		}
	}, [
		state.allChecked,
		state.toggledItems,
		triggerFilterChange,
		isInitializing,
		lastTriggeredState,
	]);

	// Cleanup timer on unmount
	useEffect(() => {
		return () => {
			if (filterTimer) {
				clearTimeout(filterTimer);
			}
		};
	}, [filterTimer]);

	return (
		<div className={cn('w-full space-y-3', className)}>
			{/* Search Input */}
			<SearchInput
				value={state.searchQuery}
				onChange={handleSearch}
				placeholder={options.searchPlaceholder || 'Поиск...'}
				debounceMs={300}
			/>

			{/* Checkbox List */}
			<CheckboxList
				items={state.items}
				toggledItems={state.toggledItems}
				allChecked={state.allChecked}
				inProgress={state.inProgress}
				fullLoaded={state.fullLoaded}
				valueView={options.valueView}
				selectAllText={options.selectAllText || 'Выбрать все'}
				loadingText={options.loadingText || 'Загрузка...'}
				onToggleAll={handleToggleAll}
				onToggleItem={handleToggleItem}
				onLoadMore={handleLoadMore}
				isChecked={isChecked}
			/>
		</div>
	);
};

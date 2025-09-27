import React, { createContext, useContext, useCallback, useMemo } from 'react';
import type {
	FilterService,
	FilterState,
	FilterActions,
	FilterComputed,
} from '../services/filters';

// Типы для контекста
export interface FilterContextValue<T extends Record<string, FilterState>> {
	state: T;
	actions: FilterActions;
	computed: FilterComputed;
}

// Создание контекста
export function createFilterContext<T extends Record<string, FilterState>>() {
	return createContext<FilterContextValue<T> | null>(null);
}

// Провайдер контекста
export interface FilterProviderProps<T extends Record<string, FilterState>> {
	children: React.ReactNode;
	service: FilterService<T>;
	onFiltersChange?: (filters: T) => void;
	debounceMs?: number;
}

export function FilterProvider<T extends Record<string, FilterState>>({
	children,
	service,
	onFiltersChange,
	debounceMs = 300,
}: FilterProviderProps<T>) {
	const [state, setState] = React.useState<T>(() => service.createInitialState());
	const debounceTimerRef = React.useRef<NodeJS.Timeout | null>(null);

	// Действия с фильтрами
	const actions: FilterActions = useMemo(
		() => ({
			updateFilter: (id: string, value: any) => {
				setState(prevState => {
					const newState = service.updateFilter(prevState, id, value);

					// Дебаунс для вызова onFiltersChange
					if (debounceTimerRef.current) {
						clearTimeout(debounceTimerRef.current);
					}

					debounceTimerRef.current = setTimeout(() => {
						onFiltersChange?.(newState);
					}, debounceMs);

					return newState;
				});
			},

			clearFilter: (id: string) => {
				setState(prevState => {
					const newState = service.clearFilter(prevState, id);
					onFiltersChange?.(newState);
					return newState;
				});
			},

			clearAllFilters: () => {
				setState(prevState => {
					const newState = service.clearAllFilters(prevState);
					onFiltersChange?.(newState);
					return newState;
				});
			},

			setFilters: (filters: T) => {
				setState(filters);
				onFiltersChange?.(filters);
			},
		}),
		[service, onFiltersChange, debounceMs]
	);

	// Вычисляемые значения
	const computed: FilterComputed = useMemo(
		() => ({
			isAnyFilterActive: service.isAnyFilterActive(state),
			activeFiltersCount: service.getActiveFiltersCount(state),
			apiFormat: service.toApiFormat(state),
		}),
		[service, state]
	);

	// Очистка таймера при размонтировании
	React.useEffect(() => {
		return () => {
			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current);
			}
		};
	}, []);

	const contextValue: FilterContextValue<T> = useMemo(
		() => ({
			state,
			actions,
			computed,
		}),
		[state, actions, computed]
	);

	return <FilterContext.Provider value={contextValue}>{children}</FilterContext.Provider>;
}

// Хук для использования контекста
export function useFilterContext<T extends Record<string, FilterState>>(
	context: React.Context<FilterContextValue<T> | null>
): FilterContextValue<T> {
	const filterContext = useContext(context);
	if (!filterContext) {
		throw new Error('useFilterContext must be used within a FilterProvider');
	}
	return filterContext;
}

// Создание контекста для расписания
export const ScheduleFilterContext = createFilterContext<any>();

// Провайдер для фильтров расписания
export interface ScheduleFilterProviderProps {
	children: React.ReactNode;
	onFiltersChange?: (filters: any) => void;
	debounceMs?: number;
}

export function ScheduleFilterProvider({
	children,
	onFiltersChange,
	debounceMs,
}: ScheduleFilterProviderProps) {
	const { ScheduleFilterService } = require('../services/filters');
	const service = useMemo(() => new ScheduleFilterService(), []);

	return (
		<FilterProvider service={service} onFiltersChange={onFiltersChange} debounceMs={debounceMs}>
			{children}
		</FilterProvider>
	);
}

// Хук для использования контекста расписания
export function useScheduleFilterContext() {
	return useFilterContext(ScheduleFilterContext);
}

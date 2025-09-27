/**
 * Типы для состояний загрузки расписания
 * Следует принципам SOLID - каждый тип отвечает за конкретное состояние
 */

// Базовое состояние загрузки
export interface LoadingState {
	readonly isLoading: boolean;
	readonly error: Error | null;
}

// Состояние обновления данных (когда данные уже есть, но обновляются)
export interface RefreshingState {
	readonly isRefreshing: boolean;
	readonly error: Error | null;
}

// Состояние инициализации (первая загрузка)
export interface InitializingState {
	readonly isInitializing: boolean;
	readonly error: Error | null;
}

// Состояние обновления данных в фоне
export interface BackgroundUpdateState {
	readonly isUpdatingInBackground: boolean;
	readonly error: Error | null;
}

// Объединенное состояние для расписания
export interface ScheduleLoadingState extends LoadingState, RefreshingState {
	readonly isInitializing: boolean;
	readonly isUpdatingInBackground: boolean;
}

// Утилиты для проверки состояний
export const ScheduleLoadingUtils = {
	/**
	 * Проверяет, показывать ли основной индикатор загрузки
	 */
	shouldShowMainLoader: (state: ScheduleLoadingState): boolean => {
		return state.isInitializing;
	},

	/**
	 * Проверяет, показывать ли overlay обновления
	 */
	shouldShowUpdateOverlay: (state: ScheduleLoadingState): boolean => {
		return state.isRefreshing && !state.isInitializing;
	},

	/**
	 * Проверяет, есть ли ошибка
	 */
	hasError: (state: ScheduleLoadingState): boolean => {
		return state.error !== null;
	},

	/**
	 * Проверяет, можно ли взаимодействовать с интерфейсом
	 */
	isInteractive: (state: ScheduleLoadingState): boolean => {
		return !state.isInitializing && !ScheduleLoadingUtils.hasError(state);
	},
} as const;

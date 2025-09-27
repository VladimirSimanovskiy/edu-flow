import type {
	ScheduleLoadingState,
	LoadingState,
	RefreshingState,
	InitializingState,
	BackgroundUpdateState,
} from '../types/scheduleLoading';

export interface ILoadingStateProvider {
	getLoadingState(): LoadingState;
}

export interface IRefreshingStateProvider {
	getRefreshingState(): RefreshingState;
}

export interface IInitializingStateProvider {
	getInitializingState(): InitializingState;
}

export interface IBackgroundUpdateStateProvider {
	getBackgroundUpdateState(): BackgroundUpdateState;
}

/**
 * Сервис для объединения состояний загрузки
 */
export class ScheduleLoadingService {
	private loadingProvider: ILoadingStateProvider;
	private refreshingProvider: IRefreshingStateProvider;
	private initializingProvider: IInitializingStateProvider;
	private backgroundUpdateProvider: IBackgroundUpdateStateProvider;

	constructor(
		loadingProvider: ILoadingStateProvider,
		refreshingProvider: IRefreshingStateProvider,
		initializingProvider: IInitializingStateProvider,
		backgroundUpdateProvider: IBackgroundUpdateStateProvider
	) {
		this.loadingProvider = loadingProvider;
		this.refreshingProvider = refreshingProvider;
		this.initializingProvider = initializingProvider;
		this.backgroundUpdateProvider = backgroundUpdateProvider;
	}

	/**
	 * Получает объединенное состояние загрузки
	 */
	getScheduleLoadingState(): ScheduleLoadingState {
		const loadingState = this.loadingProvider.getLoadingState();
		const refreshingState = this.refreshingProvider.getRefreshingState();
		const initializingState = this.initializingProvider.getInitializingState();
		const backgroundUpdateState = this.backgroundUpdateProvider.getBackgroundUpdateState();

		return {
			isLoading: loadingState.isLoading,
			isRefreshing: refreshingState.isRefreshing,
			isInitializing: initializingState.isInitializing,
			isUpdatingInBackground: backgroundUpdateState.isUpdatingInBackground,
			error:
				loadingState.error ||
				refreshingState.error ||
				initializingState.error ||
				backgroundUpdateState.error,
		};
	}
}

/**
 * Фабрика для создания провайдеров состояний из React Query
 */
export class StateProviderFactory {
	static createLoadingProvider(isLoading: boolean, error: Error | null): ILoadingStateProvider {
		return {
			getLoadingState: () => ({ isLoading, error }),
		};
	}

	static createRefreshingProvider(
		isFetching: boolean,
		hasData: boolean,
		error: Error | null
	): IRefreshingStateProvider {
		return {
			getRefreshingState: () => ({
				isRefreshing: isFetching && hasData,
				error,
			}),
		};
	}

	static createInitializingProvider(
		isLoading: boolean,
		hasData: boolean,
		error: Error | null
	): IInitializingStateProvider {
		return {
			getInitializingState: () => ({
				isInitializing: isLoading && !hasData,
				error,
			}),
		};
	}

	static createBackgroundUpdateProvider(
		isFetching: boolean,
		hasData: boolean,
		error: Error | null
	): IBackgroundUpdateStateProvider {
		return {
			getBackgroundUpdateState: () => ({
				isUpdatingInBackground: isFetching && hasData,
				error,
			}),
		};
	}
}

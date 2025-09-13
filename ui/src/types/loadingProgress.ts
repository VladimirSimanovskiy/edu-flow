export interface LoadingProgressState {
  isLoading: boolean;
  progress: number;
  message?: string;
}

export interface UseLoadingProgressOptions {
  /** Минимальное время показа прогресса (в мс) */
  minDuration?: number;
  /** Автоматически увеличивать прогресс */
  autoIncrement?: boolean;
  /** Скорость автоинкремента (в мс) */
  incrementInterval?: number;
  /** Начальное значение прогресса */
  initialProgress?: number;
}

export interface UseLoadingProgressReturn {
  /** Текущее состояние загрузки */
  state: LoadingProgressState;
  /** Начать загрузку */
  startLoading: (message?: string) => void;
  /** Обновить прогресс */
  updateProgress: (progress: number, message?: string) => void;
  /** Завершить загрузку */
  finishLoading: () => void;
  /** Сбросить состояние */
  reset: () => void;
}

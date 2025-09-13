import { useEffect, useRef } from 'react';
import { useLoadingProgress } from '@/hooks/useLoadingProgress';
import type { ScheduleLoadingState } from '@/types/scheduleLoading';

export interface UseScheduleLoadingProgressOptions {
  /** Минимальное время показа прогресса (в мс) */
  minDuration?: number;
  /** Автоматически увеличивать прогресс */
  autoIncrement?: boolean;
  /** Скорость автоинкремента (в мс) */
  incrementInterval?: number;
}

export interface UseScheduleLoadingProgressReturn {
  /** Состояние прогресса загрузки */
  progressState: ReturnType<typeof useLoadingProgress>['state'];
  /** Начать загрузку */
  startLoading: ReturnType<typeof useLoadingProgress>['startLoading'];
  /** Обновить прогресс */
  updateProgress: ReturnType<typeof useLoadingProgress>['updateProgress'];
  /** Завершить загрузку */
  finishLoading: ReturnType<typeof useLoadingProgress>['finishLoading'];
  /** Сбросить состояние */
  reset: ReturnType<typeof useLoadingProgress>['reset'];
}

/**
 * Хук для интеграции прогресс-бара с системой загрузки расписания
 */
export const useScheduleLoadingProgress = (
  loadingState: ScheduleLoadingState,
  options: UseScheduleLoadingProgressOptions = {}
): UseScheduleLoadingProgressReturn => {
  const {
    minDuration = 800,
    incrementInterval = 60,
  } = options;

  const progressHook = useLoadingProgress({
    minDuration,
    autoIncrement: false, // Отключаем автоинкремент для плавного заполнения
    incrementInterval,
  });

  const prevLoadingStateRef = useRef<ScheduleLoadingState>(loadingState);
  const isInitialLoadRef = useRef(true);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Функция для плавной анимации прогресса
  const animateProgress = (targetProgress: number, duration: number = 800) => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    startTimeRef.current = Date.now();
    const startProgress = progressHook.state.progress;

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      
      // Используем easeOut функцию для плавного замедления
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentProgress = startProgress + (targetProgress - startProgress) * easeOut;
      
      if (progressHook.state.isLoading) {
        progressHook.updateProgress(Math.round(currentProgress));
      }

      if (progress < 1 && progressHook.state.isLoading) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  // Функция для очистки анимации
  const clearAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  useEffect(() => {
    const prevState = prevLoadingStateRef.current;
    const currentState = loadingState;

    // Определяем тип загрузки
    const isInitialLoading = currentState.isLoading && !currentState.isRefreshing;
    const isRefreshing = currentState.isRefreshing;
    const hasError = !!currentState.error;

    // Если это первая загрузка
    if (isInitialLoading && isInitialLoadRef.current) {
      clearAnimation(); // Очищаем предыдущую анимацию
      progressHook.startLoading('Загрузка расписания...');
      // Плавное заполнение прогресса
      animateProgress(85, 1000);
      isInitialLoadRef.current = false;
    }
    // Если это обновление данных (рефреш)
    else if (isRefreshing && !prevState.isRefreshing) {
      clearAnimation(); // Очищаем предыдущую анимацию
      progressHook.startLoading('Обновление данных...');
      // Плавное заполнение прогресса
      animateProgress(90, 800);
    }
    // Если есть ошибка
    else if (hasError && !prevState.error) {
      clearAnimation(); // Очищаем анимацию
      progressHook.finishLoading();
    }
    // Если загрузка завершена
    else if (!isInitialLoading && !isRefreshing && (prevState.isLoading || prevState.isRefreshing)) {
      clearAnimation(); // Очищаем анимацию
      progressHook.finishLoading();
    }

    // Обновляем предыдущее состояние
    prevLoadingStateRef.current = currentState;
  }, [loadingState, progressHook]);

  // Сброс при изменении ключевых параметров
  useEffect(() => {
    if (loadingState.error) {
      clearAnimation();
      progressHook.reset();
    }
  }, [loadingState.error, progressHook]);

  // Очистка анимации при размонтировании
  useEffect(() => {
    return () => {
      clearAnimation();
    };
  }, []);

  return {
    progressState: progressHook.state,
    startLoading: progressHook.startLoading,
    updateProgress: progressHook.updateProgress,
    finishLoading: progressHook.finishLoading,
    reset: progressHook.reset,
  };
};

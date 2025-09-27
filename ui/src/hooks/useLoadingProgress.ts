import { useState, useCallback, useRef, useEffect } from 'react';
import type {
	LoadingProgressState,
	UseLoadingProgressOptions,
	UseLoadingProgressReturn,
} from '@/types/loadingProgress';

export const useLoadingProgress = (
	options: UseLoadingProgressOptions = {}
): UseLoadingProgressReturn => {
	const {
		minDuration = 500,
		autoIncrement = true,
		incrementInterval = 50,
		initialProgress = 0,
	} = options;

	const [state, setState] = useState<LoadingProgressState>({
		isLoading: false,
		progress: initialProgress,
	});

	const startTimeRef = useRef<number>(0);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const clearTimers = useCallback(() => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
	}, []);

	const startLoading = useCallback(
		(message?: string) => {
			clearTimers();
			startTimeRef.current = Date.now();

			setState({
				isLoading: true,
				progress: initialProgress,
				message,
			});

			if (autoIncrement) {
				intervalRef.current = setInterval(() => {
					setState(prev => {
						if (!prev.isLoading) return prev;

						const elapsed = Date.now() - startTimeRef.current;
						const timeProgress = Math.min(elapsed / (minDuration * 1.5), 0.85); // Максимум 85% по времени
						const increment = Math.max(0.5, 2 - elapsed / 1000); // Замедляем со временем
						const newProgress = Math.min(prev.progress + increment, timeProgress);

						return {
							...prev,
							progress: Math.min(newProgress, 85), // Не доходим до 100% автоматически
						};
					});
				}, incrementInterval);
			}
		},
		[autoIncrement, incrementInterval, minDuration, initialProgress, clearTimers]
	);

	const updateProgress = useCallback((progress: number, message?: string) => {
		setState(prev => ({
			...prev,
			progress: Math.max(0, Math.min(100, progress)),
			...(message && { message }),
		}));
	}, []);

	const finishLoading = useCallback(() => {
		const elapsed = Date.now() - startTimeRef.current;
		const remainingTime = Math.max(0, minDuration - elapsed);

		// Устанавливаем 100% прогресс
		setState(prev => ({
			...prev,
			progress: 100,
		}));

		// Ждем минимальное время, затем скрываем
		timeoutRef.current = setTimeout(
			() => {
				setState({
					isLoading: false,
					progress: initialProgress,
				});
				clearTimers();
			},
			Math.max(remainingTime, 200)
		); // Минимум 200мс для показа 100%
	}, [minDuration, initialProgress, clearTimers]);

	const reset = useCallback(() => {
		clearTimers();
		setState({
			isLoading: false,
			progress: initialProgress,
		});
	}, [initialProgress, clearTimers]);

	// Очистка при размонтировании
	useEffect(() => {
		return clearTimers;
	}, [clearTimers]);

	return {
		state,
		startLoading,
		updateProgress,
		finishLoading,
		reset,
	};
};

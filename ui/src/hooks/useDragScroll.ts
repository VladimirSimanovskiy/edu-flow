import { useRef, useCallback, useEffect, useState } from 'react';

interface UseDragScrollOptions {
	/**
	 * Чувствительность скролла при перетаскивании
	 * @default 1
	 */
	sensitivity?: number;
}

interface UseDragScrollReturn {
	/**
	 * Ref для элемента, который должен поддерживать drag scroll
	 */
	scrollRef: React.RefObject<HTMLDivElement>;
	/**
	 * CSS классы для применения к элементу
	 */
	className: string;
	/**
	 * Обработчики событий для применения к элементу
	 */
	eventHandlers: {
		onMouseDown: (e: React.MouseEvent) => void;
		onMouseMove: (e: React.MouseEvent) => void;
		onMouseUp: () => void;
		onMouseLeave: () => void;
	};
	hasLeftShadow: boolean;
	hasRightShadow: boolean;
}

export const useDragScroll = (options: UseDragScrollOptions = {}): UseDragScrollReturn => {
	const { sensitivity = 1 } = options;

	const scrollRef = useRef<HTMLDivElement>(null);
	const isDraggingRef = useRef(false);
	const startXRef = useRef(0);
	const startScrollLeftRef = useRef(0);
	const pendingClientXRef = useRef<number | null>(null);
	const moveRafIdRef = useRef<number | null>(null);
	const shadowRafIdRef = useRef<number | null>(null);
	const [hasLeftShadow, setHasLeftShadow] = useState(false);
	const [hasRightShadow, setHasRightShadow] = useState(false);
	const lastLeftShadowRef = useRef(false);
	const lastRightShadowRef = useRef(false);

	const updateShadows = useCallback(() => {
		const el = scrollRef.current;
		if (!el) return;
		const { scrollLeft, scrollWidth, clientWidth } = el;
		const atStart = scrollLeft <= 0;
		const atEnd = Math.ceil(scrollLeft + clientWidth) >= scrollWidth;
		const nextLeft = !atStart;
		const nextRight = !atEnd;
		if (lastLeftShadowRef.current !== nextLeft) {
			lastLeftShadowRef.current = nextLeft;
			setHasLeftShadow(nextLeft);
		}
		if (lastRightShadowRef.current !== nextRight) {
			lastRightShadowRef.current = nextRight;
			setHasRightShadow(nextRight);
		}
	}, []);

	// Обработчик начала перетаскивания
	const handleStart = useCallback((clientX: number) => {
		if (!scrollRef.current) return;

		isDraggingRef.current = true;
		startXRef.current = clientX;
		startScrollLeftRef.current = scrollRef.current.scrollLeft;
	}, []);

	// Обработчик движения во время перетаскивания
	const handleMove = useCallback(
		(clientX: number) => {
			if (!isDraggingRef.current || !scrollRef.current) return;
			const deltaX = clientX - startXRef.current;
			const newScrollLeft = startScrollLeftRef.current - deltaX * sensitivity;
			scrollRef.current.scrollLeft = newScrollLeft;
			updateShadows();
		},
		[sensitivity, updateShadows]
	);

	const scheduleMove = useCallback(() => {
		if (moveRafIdRef.current !== null) return;
		moveRafIdRef.current = requestAnimationFrame(() => {
			moveRafIdRef.current = null;
			const x = pendingClientXRef.current;
			if (x != null) {
				handleMove(x);
			}
		});
	}, [handleMove]);

	// Обработчик окончания перетаскивания
	const handleEnd = useCallback(() => {
		if (!isDraggingRef.current) return;

		isDraggingRef.current = false;
	}, []);

	// Обработчики событий мыши (используем window listeners для движения во время drag)
	const onMouseDown = useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault();
			handleStart(e.clientX);
			const onMove = (ev: MouseEvent) => {
				pendingClientXRef.current = ev.clientX;
				scheduleMove();
			};
			const onUp = () => {
				handleEnd();
				window.removeEventListener('mousemove', onMove);
				window.removeEventListener('mouseup', onUp);
			};
			window.addEventListener('mousemove', onMove, { passive: true });
			window.addEventListener('mouseup', onUp, { passive: true });
		},
		[handleStart, handleEnd, scheduleMove]
	);

	// noop, движение обрабатывается на window
	const onMouseMove = useCallback((_e: React.MouseEvent) => {
		// no-op
	}, []);

	const onMouseUp = useCallback(() => {
		handleEnd();
	}, [handleEnd]);

	const onMouseLeave = useCallback(() => {
		handleEnd();
	}, [handleEnd]);

	useEffect(() => {
		const el = scrollRef.current;
		if (!el) return;
		updateShadows();
		const onScroll = () => {
			if (shadowRafIdRef.current !== null) return;
			shadowRafIdRef.current = requestAnimationFrame(() => {
				shadowRafIdRef.current = null;
				updateShadows();
			});
		};
		el.addEventListener('scroll', onScroll, { passive: true });
		return () => {
			el.removeEventListener('scroll', onScroll);
		};
	}, [updateShadows]);

	useEffect(() => {
		return () => {
			if (moveRafIdRef.current !== null) cancelAnimationFrame(moveRafIdRef.current);
			if (shadowRafIdRef.current !== null) cancelAnimationFrame(shadowRafIdRef.current);
		};
	}, []);

	return {
		scrollRef,
		className: 'select-none cursor-grab active:cursor-grabbing',
		eventHandlers: {
			onMouseDown,
			onMouseMove,
			onMouseUp,
			onMouseLeave,
		},
		hasLeftShadow,
		hasRightShadow,
	};
};

import { useRef, useCallback } from 'react';

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
}

export const useDragScroll = (options: UseDragScrollOptions = {}): UseDragScrollReturn => {
  const {
    sensitivity = 1,
  } = options;

  const scrollRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);


  // Обработчик начала перетаскивания
  const handleStart = useCallback((clientX: number) => {
    if (!scrollRef.current) return;

    isDraggingRef.current = true;
    startXRef.current = clientX;
    startScrollLeftRef.current = scrollRef.current.scrollLeft;
  }, []);

  // Обработчик движения во время перетаскивания
  const handleMove = useCallback((clientX: number) => {
    if (!isDraggingRef.current || !scrollRef.current) return;

    const deltaX = clientX - startXRef.current;
    const newScrollLeft = startScrollLeftRef.current - deltaX * sensitivity;

    scrollRef.current.scrollLeft = newScrollLeft;
  }, [sensitivity]);

  // Обработчик окончания перетаскивания
  const handleEnd = useCallback(() => {
    if (!isDraggingRef.current) return;

    isDraggingRef.current = false;
  }, []);

  // Обработчики событий мыши
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX);
  }, [handleStart]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    handleMove(e.clientX);
  }, [handleMove]);

  const onMouseUp = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  const onMouseLeave = useCallback(() => {
    handleEnd();
  }, [handleEnd]);


  return {
    scrollRef,
    className: 'select-none cursor-grab active:cursor-grabbing',
    eventHandlers: {
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onMouseLeave,
    },
  };
};

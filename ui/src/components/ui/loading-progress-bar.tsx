import React from 'react';
import { cn } from '@/utils/cn';
import type { LoadingProgressState } from '@/types/loadingProgress';

export interface LoadingProgressBarProps {
  /** Состояние загрузки */
  state: LoadingProgressState;
  /** Позиция прогресс-бара */
  position?: 'top' | 'bottom' | 'overlay';
  /** Размер прогресс-бара */
  size?: 'sm' | 'md' | 'lg';
  /** Дополнительные CSS классы */
  className?: string;
  /** Показывать ли сообщение */
  showMessage?: boolean;
  /** Анимация появления/исчезновения */
  animated?: boolean;
  /** Цветовая схема */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
}

// Классы для вариантов прогресс-бара
const variantClasses = {
  default: 'bg-primary-500',
  primary: 'bg-primary-600',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  error: 'bg-error-500',
};

export const LoadingProgressBar: React.FC<LoadingProgressBarProps> = ({
  state,
  position = 'top',
  className,
  animated = true,
  variant = 'default',
}) => {
  if (!state.isLoading && state.progress === 0) {
    return null;
  }

  const progressBar = (
    <div
      className={cn(
        'w-full transition-all duration-300 ease-in-out',
        'h-1', // Фиксированная высота - тоньше
        animated && 'animate-pulse',
        className
      )}
    >
      {/* Кастомный прогресс-бар с правильной цветовой схемой */}
      <div className="relative h-full w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className={cn(
            'h-full transition-all duration-500 ease-out',
            variantClasses[variant]
          )}
          style={{ width: `${state.isLoading ? state.progress : 0}%` }}
        />
      </div>
    </div>
  );

  // Убираем сообщение - делаем просто полоску

  if (position === 'overlay') {
    return (
      <div
        className={cn(
          'absolute top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm',
          'transition-all duration-300 ease-in-out',
          state.isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
      >
        <div className="p-2">
          {progressBar}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'transition-all duration-300 ease-in-out'
      )}
    >
      {progressBar}
    </div>
  );
};

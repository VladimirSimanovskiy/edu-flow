import React from 'react';
import { LoadingProgressBar } from '../ui/loading-progress-bar';
import type { LoadingProgressState } from '@/types/loadingProgress';
import { cn } from '@/utils/cn';

export interface ScheduleLoadingProgressProps {
  /** Состояние загрузки */
  state: LoadingProgressState;
  /** Позиция прогресс-бара */
  position?: 'top' | 'overlay';
  /** Дополнительные CSS классы */
  className?: string;
  /** Показывать ли сообщение */
  showMessage?: boolean;
}

export const ScheduleLoadingProgress: React.FC<ScheduleLoadingProgressProps> = ({
  state,
  position = 'top',
  className,
  showMessage = true,
}) => {
  return (
    <div className="h-1"> {/* Зарезервированное место под прогресс-бар - 4px */}
      {state.isLoading && (
    <LoadingProgressBar
      state={state}
      position={position}
      size="md"
      variant="default"
      showMessage={showMessage}
      animated={false} // Убираем pulse анимацию
      className={cn(
        position === 'overlay' && 'shadow-lg',
        className
      )}
    />
      )}
    </div>
  );
};

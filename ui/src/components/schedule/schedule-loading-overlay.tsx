import React from 'react';
import { cn } from '../../utils/cn';
import { LoadingSpinner } from '../ui/loading-spinner';

interface ScheduleLoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  className?: string;
}

export const ScheduleLoadingOverlay: React.FC<ScheduleLoadingOverlayProps> = ({
  isVisible,
  message = 'Загрузка данных...',
  className
}) => {
  if (!isVisible) return null;

  return (
    <div 
      className={cn(
        'absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 transition-opacity duration-200',
        className
      )}
    >
      <div className="flex flex-col items-center gap-3">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  );
};

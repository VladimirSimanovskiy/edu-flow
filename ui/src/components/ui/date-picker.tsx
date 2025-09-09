import React from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '../../utils/cn';
import { tokens } from '../../design-system/tokens';

interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  viewType: 'day' | 'week';
  className?: string;
  disabled?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  viewType,
  className,
  disabled = false,
}) => {
  const handlePrevious = () => {
    const newDate = new Date(value);
    if (viewType === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() - 7);
    }
    onChange(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(value);
    if (viewType === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    onChange(newDate);
  };

  const handleToday = () => {
    onChange(new Date());
  };

  const formatDisplayDate = () => {
    if (viewType === 'day') {
      return format(value, 'd MMMM yyyy', { locale: ru });
    } else {
      const weekStart = new Date(value);
      const dayOfWeek = weekStart.getDay();
      const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      weekStart.setDate(weekStart.getDate() + diff);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      return `${format(weekStart, 'd MMM', { locale: ru })} - ${format(weekEnd, 'd MMM yyyy', { locale: ru })}`;
    }
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <button
        onClick={handlePrevious}
        disabled={disabled}
        className={cn(
          'p-2 rounded-md border transition-colors',
          disabled 
            ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
        )}
        style={{
          borderRadius: tokens.borderRadius.md,
          transition: `all ${tokens.animation.duration.fast} ${tokens.animation.easing.ease}`
        }}
      >
        <svg 
          className="w-4 h-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15 19l-7-7 7-7" 
          />
        </svg>
      </button>

      <button
        onClick={handleToday}
        disabled={disabled}
        className={cn(
          'px-4 py-2 rounded-md border transition-colors',
          disabled 
            ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
        )}
        style={{
          fontSize: tokens.typography.fontSize.sm,
          fontWeight: tokens.typography.fontWeight.medium,
          borderRadius: tokens.borderRadius.md,
          transition: `all ${tokens.animation.duration.fast} ${tokens.animation.easing.ease}`
        }}
      >
        Сегодня
      </button>

      <div 
        className="px-4 py-2 text-center font-medium"
        style={{
          fontSize: tokens.typography.fontSize.sm,
          fontWeight: tokens.typography.fontWeight.medium,
          color: tokens.colors.gray[900],
          minWidth: '200px'
        }}
      >
        {formatDisplayDate()}
      </div>

      <button
        onClick={handleNext}
        disabled={disabled}
        className={cn(
          'p-2 rounded-md border transition-colors',
          disabled 
            ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
        )}
        style={{
          borderRadius: tokens.borderRadius.md,
          transition: `all ${tokens.animation.duration.fast} ${tokens.animation.easing.ease}`
        }}
      >
        <svg 
          className="w-4 h-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 5l7 7-7 7" 
          />
        </svg>
      </button>
    </div>
  );
};
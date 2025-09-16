import React from 'react';
import { cn } from '../../utils/cn';
import { Toggle } from './toggle';

interface ViewToggleProps {
  viewType: 'day' | 'week';
  onChange: (viewType: 'day' | 'week') => void;
  className?: string;
  disabled?: boolean;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({
  viewType,
  onChange,
  className,
  disabled = false,
}) => {
  const options = [
    { value: 'day' as const, label: 'День', shortLabel: 'Д' },
    { value: 'week' as const, label: 'Неделя', shortLabel: 'Н' }
  ];

  return (
    <div className={cn('inline-flex rounded-lg border p-0.5 bg-background', className)}>
      {options.map((option) => (
        <Toggle
          key={option.value}
          pressed={viewType === option.value}
          onPressedChange={() => !disabled && onChange(option.value)}
          disabled={disabled}
          variant="outline"
          size="sm"
          className={cn(
            'px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all border-0 h-8 min-w-[3rem] sm:min-w-[4rem]',
            viewType === option.value
              ? 'bg-primary text-primary-foreground shadow-sm hover:bg-primary-600'
              : 'bg-transparent hover:bg-primary-50 hover:text-primary-700 active:bg-primary-100'
          )}
        >
          <span className="whitespace-nowrap">{option.label}</span>
        </Toggle>
      ))}
    </div>
  );
};
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
            'px-3 py-1.5 text-sm font-medium rounded-md transition-all border-0 h-8',
            viewType === option.value
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-transparent hover:bg-accent hover:text-accent-foreground'
          )}
        >
          <span className="hidden sm:inline">{option.label}</span>
          <span className="sm:hidden">{option.shortLabel}</span>
        </Toggle>
      ))}
    </div>
  );
};
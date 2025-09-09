import React from 'react';
import { cn } from '../../utils/cn';
import { tokens } from '../../design-system/tokens';

interface ViewToggleProps {
  viewType: 'day' | 'week';
  onChange: (viewType: 'day' | 'week') => void;
  className?: string;
  disabled?: boolean;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({
  viewType,
  onChange,
  disabled = false,
}) => {
  const options = [
    { value: 'day' as const, label: 'День' },
    { value: 'week' as const, label: 'Неделя' }
  ];

  return (
    <div 
      className={cn(
        'inline-flex rounded-lg border p-0.5 sm:p-1',
        disabled ? 'bg-gray-100 border-gray-200' : 'bg-white border-gray-300'
      )}
      style={{
        borderRadius: tokens.borderRadius.lg,
        borderColor: disabled ? tokens.colors.gray[200] : tokens.colors.gray[300]
      }}
    >
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => !disabled && onChange(option.value)}
          disabled={disabled}
          className={cn(
            'px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all',
            viewType === option.value
              ? 'bg-blue-600 text-white shadow-sm'
              : disabled
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
          )}
          style={{
            fontWeight: tokens.typography.fontWeight.medium,
            borderRadius: tokens.borderRadius.md,
            transition: `all ${tokens.animation.duration.fast} ${tokens.animation.easing.ease}`,
            ...(viewType === option.value && {
              backgroundColor: tokens.colors.primary[600],
              color: 'white',
              boxShadow: tokens.boxShadow.sm
            })
          }}
        >
          <span className="hidden sm:inline">{option.label}</span>
          <span className="sm:hidden">{option.label.charAt(0)}</span>
        </button>
      ))}
    </div>
  );
};
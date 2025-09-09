import React from 'react';
import { cn } from '../../utils/cn';
import { tokens } from '../../design-system/tokens';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className,
  text,
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          width: '1rem',
          height: '1rem',
          borderWidth: '2px'
        };
      case 'lg':
        return {
          width: '3rem',
          height: '3rem',
          borderWidth: '4px'
        };
      default:
        return {
          width: '2rem',
          height: '2rem',
          borderWidth: '3px'
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <div className={cn('flex flex-col items-center justify-center p-8', className)}>
      <div
        className="animate-spin rounded-full border-solid border-gray-300 border-t-blue-600"
        style={{
          ...sizeStyles,
          animation: `spin ${tokens.animation.duration.slow} linear infinite`
        }}
      />
      {text && (
        <p 
          className="mt-4 text-gray-600"
          style={{
            fontSize: tokens.typography.fontSize.sm,
            color: tokens.colors.gray[600]
          }}
        >
          {text}
        </p>
      )}
    </div>
  );
};
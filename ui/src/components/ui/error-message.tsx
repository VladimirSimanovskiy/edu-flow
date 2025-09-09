import React from 'react';
import { cn } from '../../utils/cn';
import { tokens } from '../../design-system/tokens';

interface ErrorMessageProps {
  error: string;
  className?: string;
  variant?: 'default' | 'inline' | 'banner';
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  error,
  className,
  variant = 'default',
  onRetry,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'inline':
        return {
          padding: tokens.spacing[2],
          borderRadius: tokens.borderRadius.sm,
          backgroundColor: tokens.colors.error[50],
          borderColor: tokens.colors.error[200],
          borderWidth: '1px',
          borderStyle: 'solid'
        };
      case 'banner':
        return {
          padding: tokens.spacing[4],
          borderRadius: tokens.borderRadius.lg,
          backgroundColor: tokens.colors.error[50],
          borderColor: tokens.colors.error[200],
          borderWidth: '1px',
          borderStyle: 'solid',
          marginBottom: tokens.spacing[4]
        };
      default:
        return {
          padding: tokens.spacing[3],
          borderRadius: tokens.borderRadius.md,
          backgroundColor: tokens.colors.error[50],
          borderColor: tokens.colors.error[200],
          borderWidth: '1px',
          borderStyle: 'solid'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div 
      className={cn('flex items-start gap-3', className)}
      style={styles}
    >
      <div 
        className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
        style={{
          backgroundColor: tokens.colors.error[500],
          color: 'white'
        }}
      >
        <svg 
          className="w-3 h-3" 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path 
            fillRule="evenodd" 
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
            clipRule="evenodd" 
          />
        </svg>
      </div>
      
      <div className="flex-1 min-w-0">
        <p 
          className="font-medium"
          style={{
            fontSize: tokens.typography.fontSize.sm,
            fontWeight: tokens.typography.fontWeight.medium,
            color: tokens.colors.error[800]
          }}
        >
          Ошибка
        </p>
        <p 
          className="mt-1"
          style={{
            fontSize: tokens.typography.fontSize.sm,
            color: tokens.colors.error[700]
          }}
        >
          {error}
        </p>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-sm font-medium underline hover:no-underline"
            style={{
              fontSize: tokens.typography.fontSize.sm,
              fontWeight: tokens.typography.fontWeight.medium,
              color: tokens.colors.error[600],
              transition: `color ${tokens.animation.duration.fast} ${tokens.animation.easing.ease}`
            }}
          >
            Попробовать снова
          </button>
        )}
      </div>
    </div>
  );
};
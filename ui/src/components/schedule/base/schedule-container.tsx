import React from 'react';
import { cn } from '../../../utils/cn';
import { tokens } from '../../../design-system/tokens';

interface ScheduleContainerProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  loading?: boolean;
  loadingText?: string;
}

export const ScheduleContainer: React.FC<ScheduleContainerProps> = ({
  children,
  className,
  title,
  subtitle,
  loading = false,
  loadingText = 'Загрузка...',
}) => {
  if (loading) {
    return (
      <div className={cn(
        'bg-white rounded-lg border shadow-sm p-8',
        className
      )}>
        <div className="flex items-center justify-center">
          <div 
            className="text-gray-500"
            style={{ 
              fontSize: tokens.typography.fontSize.sm,
              color: tokens.colors.gray[500]
            }}
          >
            {loadingText}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      'bg-white rounded-lg border shadow-sm overflow-hidden',
      className
    )}>
      {(title || subtitle) && (
        <div 
          className="p-4 border-b"
          style={{ borderColor: tokens.colors.gray[200] }}
        >
          {title && (
            <h3 
              className="text-lg font-semibold"
              style={{ 
                fontSize: tokens.typography.fontSize.lg,
                fontWeight: tokens.typography.fontWeight.semibold,
                color: tokens.colors.gray[900]
              }}
            >
              {title}
            </h3>
          )}
          {subtitle && (
            <p 
              className="text-sm text-gray-600 mt-1"
              style={{ 
                fontSize: tokens.typography.fontSize.sm,
                color: tokens.colors.gray[600]
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

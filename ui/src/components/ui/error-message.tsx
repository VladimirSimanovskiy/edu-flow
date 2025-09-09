import React from 'react';
import { AlertTriangle, RefreshCw, X } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/cn';

interface ErrorMessageProps {
  error: Error | string;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
  showDetails?: boolean;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  error,
  onRetry,
  onDismiss,
  className,
  showDetails = false,
}) => {
  const errorMessage = typeof error === 'string' ? error : error.message;
  const errorStack = typeof error === 'string' ? undefined : error.stack;

  return (
    <div className={cn(
      'bg-red-50 border border-red-200 rounded-lg p-4',
      className
    )}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertTriangle className="w-5 h-5 text-red-400" />
        </div>
        
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">
            Произошла ошибка
          </h3>
          
          <div className="mt-2 text-sm text-red-700">
            <p>{errorMessage}</p>
          </div>

          {showDetails && errorStack && (
            <details className="mt-3">
              <summary className="cursor-pointer text-xs text-red-600 hover:text-red-800">
                Показать детали
              </summary>
              <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto">
                {errorStack}
              </pre>
            </details>
          )}

          <div className="mt-4 flex gap-2">
            {onRetry && (
              <Button
                size="sm"
                variant="outline"
                onClick={onRetry}
                className="text-red-700 border-red-300 hover:bg-red-100"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Попробовать снова
              </Button>
            )}
            
            {onDismiss && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onDismiss}
                className="text-red-700 hover:bg-red-100"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Calendar, CalendarDays } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ViewToggleProps {
  viewType: 'day' | 'week';
  onChange: (type: 'day' | 'week') => void;
  className?: string;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({
  viewType,
  onChange,
  className,
}) => {
  return (
    <div className={cn('flex rounded-md border', className)}>
      <button
        onClick={() => onChange('day')}
        className={cn(
          'flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors',
          'first:rounded-l-md last:rounded-r-md',
          viewType === 'day'
            ? 'bg-primary text-primary-foreground'
            : 'bg-background text-foreground hover:bg-accent'
        )}
      >
        <Calendar className="h-4 w-4" />
        День
      </button>
      <button
        onClick={() => onChange('week')}
        className={cn(
          'flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors',
          'first:rounded-l-md last:rounded-r-md',
          viewType === 'week'
            ? 'bg-primary text-primary-foreground'
            : 'bg-background text-foreground hover:bg-accent'
        )}
      >
        <CalendarDays className="h-4 w-4" />
        Неделя
      </button>
    </div>
  );
};

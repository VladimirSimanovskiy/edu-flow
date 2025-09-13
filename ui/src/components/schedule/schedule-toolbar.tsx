import React from 'react';
import { cn } from '../../utils/cn';
import { ViewToggle } from '../ui/view-toggle';
import { DateNavigation } from './toolbar/date-navigation';

interface ScheduleToolbarProps {
  value: Date;
  onChange: (date: Date) => void;
  viewType: 'day' | 'week';
  onViewTypeChange: (viewType: 'day' | 'week') => void;
  className?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  locale?: 'ru' | 'en';
}

export const ScheduleToolbar: React.FC<ScheduleToolbarProps> = ({
  value,
  onChange,
  viewType,
  onViewTypeChange,
  className,
  disabled = false,
  minDate,
  maxDate,
  locale = 'ru'
}) => {
  return (
    <div className={cn('flex items-center justify-between w-full', className)}>
      {/* Left Zone - View Toggle */}
      <div className="flex items-center">
        <ViewToggle
          viewType={viewType}
          onChange={onViewTypeChange}
          disabled={disabled}
        />
      </div>

      {/* Right Zone - Date Navigation */}
      <div className="flex items-center gap-1">
        <DateNavigation
          value={value}
          viewType={viewType}
          onChange={onChange}
          disabled={disabled}
          minDate={minDate}
          maxDate={maxDate}
          locale={locale}
        />
      </div>
    </div>
  );
};

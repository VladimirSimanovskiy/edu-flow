import React, { useState } from 'react';
import { ru } from 'date-fns/locale';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from './button';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { QuickDateActions } from './quick-date-actions';
import { WeekPicker } from './week-picker';
import { formatDateForDisplay, navigateDate, getQuickActions } from '../../utils/dateControlUtils';
import type { DateControlProps } from '../../types/dateControl';

export const DatePicker: React.FC<DateControlProps> = ({
  value,
  onChange,
  viewType,
  className,
  disabled = false,
  minDate,
  maxDate,
  locale = 'ru'
}) => {
  // Если это недельный режим, используем WeekPicker
  if (viewType === 'week') {
    return (
      <WeekPicker
        value={value}
        onChange={onChange}
        viewType={viewType}
        className={className}
        disabled={disabled}
        minDate={minDate}
        maxDate={maxDate}
        locale={locale}
      />
    );
  }

  // Для дневного режима используем обычный DatePicker
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  const handlePrevious = () => {
    const newDate = navigateDate(value, 'prev', viewType);
    onChange(newDate);
  };

  const handleNext = () => {
    const newDate = navigateDate(value, 'next', viewType);
    onChange(newDate);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onChange(date);
      setIsCalendarOpen(false);
    }
  };

  const handleQuickAction = (action: ReturnType<typeof getQuickActions>[0]) => {
    onChange(action.getDate());
  };

  const displayDate = formatDateForDisplay(value, viewType, locale);

  return (
    <div className={cn('flex items-center gap-1 sm:gap-2', className)}>
      {/* Previous button */}
      <Button
        variant="outline"
        size="icon"
        onClick={handlePrevious}
        disabled={disabled}
        className="h-8 w-8"
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </Button>

      {/* Date display with shadcn popover */}
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-left font-normal min-w-[140px] px-3 h-8",
              !value && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span className="text-sm">{displayDate}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="center">
          <div className="flex flex-col">
            {/* Quick actions */}
            <div className="p-3 border-b">
              <QuickDateActions
                viewType={viewType}
                onActionSelect={handleQuickAction}
                disabled={disabled}
              />
            </div>
            
            {/* Calendar */}
            <div className="p-3">
              <Calendar
                mode="single"
                selected={value}
                onSelect={handleDateSelect}
                initialFocus
                locale={locale === 'ru' ? ru : undefined}
                disabled={(date) => {
                  if (minDate && date < minDate) return true;
                  if (maxDate && date > maxDate) return true;
                  return false;
                }}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Next button */}
      <Button
        variant="outline"
        size="icon"
        onClick={handleNext}
        disabled={disabled}
        className="h-8 w-8"
      >
        <ChevronRightIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};
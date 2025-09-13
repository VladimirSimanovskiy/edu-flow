import React, { useState } from 'react';
import { ru } from 'date-fns/locale';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { QuickDateActions } from '../ui/quick-date-actions';
import { Toggle } from '../ui/toggle';
import { formatDateForDisplay, navigateDate, getQuickActions, getWeekStart, getWeekEnd } from '../../utils/dateControlUtils';

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
      if (viewType === 'week') {
        const weekStart = getWeekStart(date);
        onChange(weekStart);
      } else {
        onChange(date);
      }
      setIsCalendarOpen(false);
    }
  };

  const handleWeekRangeSelect = (range: { from?: Date; to?: Date } | undefined) => {
    if (!range) return;
    
    // Определяем, какая дата была выбрана пользователем
    let selectedDate: Date | null = null;
    
    if (range?.from && range?.to) {
      // Если есть и from, и to, это означает, что пользователь выбрал дату за пределами текущего диапазона
      // Нужно определить, какая из дат новая (не входит в текущий диапазон)
      const currentWeekStart = getWeekStart(value);
      const currentWeekEnd = getWeekEnd(value);
      
      // Проверяем, какая дата не входит в текущий диапазон
      const fromInCurrentRange = range.from >= currentWeekStart && range.from <= currentWeekEnd;
      const toInCurrentRange = range.to >= currentWeekStart && range.to <= currentWeekEnd;
      
      if (!fromInCurrentRange && toInCurrentRange) {
        // from - новая дата
        selectedDate = range.from;
      } else if (fromInCurrentRange && !toInCurrentRange) {
        // to - новая дата
        selectedDate = range.to;
      } else {
        // Если обе даты новые, выбираем более позднюю
        selectedDate = range.to > range.from ? range.to : range.from;
      }
    } else if (range?.from) {
      selectedDate = range.from;
    } else if (range?.to) {
      selectedDate = range.to;
    }
    
    if (selectedDate) {
      const weekStart = getWeekStart(selectedDate);
      onChange(weekStart);
      setIsCalendarOpen(false);
    }
  };

  const handleQuickAction = (action: ReturnType<typeof getQuickActions>[0]) => {
    onChange(action.getDate());
  };

  const displayDate = formatDateForDisplay(value, viewType, locale);
  
  // Получаем начало и конец текущей недели для недельного режима
  const weekStart = getWeekStart(value);
  const weekEnd = getWeekEnd(value);

  return (
    <div className={cn('flex items-center justify-between w-full', className)}>
      {/* Left Zone - View Toggle */}
      <div className="flex items-center">
        <div className="inline-flex rounded-lg border p-0.5 bg-background">
          {[
            { value: 'day' as const, label: 'День', shortLabel: 'Д' },
            { value: 'week' as const, label: 'Неделя', shortLabel: 'Н' }
          ].map((option) => (
            <Toggle
              key={option.value}
              pressed={viewType === option.value}
              onPressedChange={() => !disabled && onViewTypeChange(option.value)}
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
      </div>

      {/* Right Zone - Date Navigation */}
      <div className="flex items-center gap-1">
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

        {/* Date display with popover */}
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
                {viewType === 'week' && (
                  <div className="text-xs text-muted-foreground mb-2 text-center">
                    Кликните на любой день для выбора недели
                  </div>
                )}
                {viewType === 'week' ? (
                  <Calendar
                    mode="range"
                    selected={{ from: weekStart, to: weekEnd }}
                    onSelect={handleWeekRangeSelect}
                    initialFocus
                    locale={locale === 'ru' ? ru : undefined}
                    disabled={(date) => {
                      if (minDate && date < minDate) return true;
                      if (maxDate && date > maxDate) return true;
                      return false;
                    }}
                    modifiersClassNames={{
                      range_start: "bg-primary text-primary-foreground rounded-l-md font-medium",
                      range_end: "bg-primary text-primary-foreground rounded-r-md font-medium",
                      range_middle: "bg-primary/30 text-primary-foreground font-medium"
                    }}
                  />
                ) : (
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
                )}
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
    </div>
  );
};

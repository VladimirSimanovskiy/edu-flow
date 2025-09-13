/**
 * Компонент выбора даты
 * Применяет принцип Single Responsibility - только выбор даты
 */

import React, { useState } from 'react';
import { ru } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Button } from '../../ui/button';
import { Calendar } from '../../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { QuickDateActions } from '../../ui/quick-date-actions';
import { formatDateForDisplay, getWeekStart, getWeekEnd, getQuickActions } from '../../../utils/dateControlUtils';

interface DatePickerProps {
  /** Текущая дата */
  value: Date;
  /** Тип представления */
  viewType: 'day' | 'week';
  /** Обработчик изменения даты */
  onChange: (date: Date) => void;
  /** Дополнительные CSS классы */
  className?: string;
  /** Состояние отключения */
  disabled?: boolean;
  /** Минимальная дата */
  minDate?: Date;
  /** Максимальная дата */
  maxDate?: Date;
  /** Локаль */
  locale?: 'ru' | 'en';
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  viewType,
  onChange,
  disabled = false,
  minDate,
  maxDate,
  locale = 'ru'
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

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
    
    let selectedDate: Date | null = null;
    
    if (range?.from && range?.to) {
      const currentWeekStart = getWeekStart(value);
      const currentWeekEnd = getWeekEnd(value);
      
      const fromInCurrentRange = range.from >= currentWeekStart && range.from <= currentWeekEnd;
      const toInCurrentRange = range.to >= currentWeekStart && range.to <= currentWeekEnd;
      
      if (!fromInCurrentRange && toInCurrentRange) {
        selectedDate = range.from;
      } else if (fromInCurrentRange && !toInCurrentRange) {
        selectedDate = range.to;
      } else {
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
  const weekStart = getWeekStart(value);
  const weekEnd = getWeekEnd(value);

  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  return (
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
                disabled={isDateDisabled}
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
                disabled={isDateDisabled}
              />
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

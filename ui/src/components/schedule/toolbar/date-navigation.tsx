/**
 * Компонент навигации по датам
 * Применяет принцип Single Responsibility - только навигация
 */

import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Button } from '../../ui/button';
import { DatePicker } from './date-picker';
import { navigateDate } from '../../../utils/dateControlUtils';

interface DateNavigationProps {
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

export const DateNavigation: React.FC<DateNavigationProps> = ({
  value,
  viewType,
  onChange,
  className,
  disabled = false,
  minDate,
  maxDate,
  locale = 'ru'
}) => {
  const handlePrevious = () => {
    const newDate = navigateDate(value, 'prev', viewType);
    onChange(newDate);
  };

  const handleNext = () => {
    const newDate = navigateDate(value, 'next', viewType);
    onChange(newDate);
  };

  return (
    <div className={className}>
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

      {/* Date picker */}
      <DatePicker
        value={value}
        viewType={viewType}
        onChange={onChange}
        disabled={disabled}
        minDate={minDate}
        maxDate={maxDate}
        locale={locale}
      />

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

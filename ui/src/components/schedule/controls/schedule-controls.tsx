/**
 * Компонент управления расписанием
 * Применяет принцип Single Responsibility - только элементы управления
 */

import React from 'react';
import { Card, CardContent } from '../../ui/card';
import { ScheduleToolbar } from '../schedule-toolbar';

interface ScheduleControlsProps {
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

export const ScheduleControls: React.FC<ScheduleControlsProps> = ({
  value,
  onChange,
  viewType,
  onViewTypeChange,
  disabled = false,
  minDate,
  maxDate,
  locale = 'ru'
}) => {
  return (
    <Card className="border shadow-none">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <ScheduleToolbar
            value={value}
            onChange={onChange}
            viewType={viewType}
            onViewTypeChange={onViewTypeChange}
            disabled={disabled}
            minDate={minDate}
            maxDate={maxDate}
            locale={locale}
          />
        </div>
      </CardContent>
    </Card>
  );
};

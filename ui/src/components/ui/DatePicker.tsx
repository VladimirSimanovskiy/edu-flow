import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfWeek, addDays, addWeeks, subWeeks } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '../../utils/cn';
import { Button } from './Button';

interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  viewType: 'day' | 'week';
  className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  viewType,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handlePrevious = () => {
    if (viewType === 'day') {
      onChange(addDays(value, -1));
    } else {
      onChange(subWeeks(value, 1));
    }
  };

  const handleNext = () => {
    if (viewType === 'day') {
      onChange(addDays(value, 1));
    } else {
      onChange(addWeeks(value, 1));
    }
  };

  const handleToday = () => {
    onChange(new Date());
  };

  const formatDisplayDate = () => {
    if (viewType === 'day') {
      return format(value, 'd MMMM yyyy', { locale: ru });
    } else {
      const startWeek = startOfWeek(value, { weekStartsOn: 1 });
      const endWeek = addDays(startWeek, 6);
      return `${format(startWeek, 'd MMM', { locale: ru })} - ${format(endWeek, 'd MMM yyyy', { locale: ru })}`;
    }
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrevious}
        className="h-8 w-8 p-0"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="min-w-[200px] justify-start"
      >
        <Calendar className="mr-2 h-4 w-4" />
        {formatDisplayDate()}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleNext}
        className="h-8 w-8 p-0"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleToday}
        className="text-sm"
      >
        Сегодня
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border rounded-md shadow-lg z-10 p-4">
          <input
            type="date"
            value={format(value, 'yyyy-MM-dd')}
            onChange={(e) => onChange(new Date(e.target.value))}
            className="w-full p-2 border rounded"
          />
        </div>
      )}
    </div>
  );
};

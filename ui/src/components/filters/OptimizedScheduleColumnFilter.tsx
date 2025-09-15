import React, { useState, useRef, memo } from 'react';
import { Filter } from 'lucide-react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { OptimizedValuesFilter } from './OptimizedValuesFilter';
import { cn } from '../../utils/cn';
import type { ValuesFilterOptions, ItemValue } from '../../types/valuesFilter';

export interface OptimizedScheduleColumnFilterProps<T extends ItemValue> {
  options: ValuesFilterOptions<T>;
  isActive?: boolean;
  className?: string;
  triggerText?: string;
}

export const OptimizedScheduleColumnFilter = memo<OptimizedScheduleColumnFilterProps<any>>(({
  options,
  isActive = false,
  className,
  triggerText = "Фильтр",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={isActive ? "default" : "outline"}
          size="sm"
          className={cn(
            "h-8 px-2 text-xs",
            isActive && "bg-primary text-primary-foreground",
            className
          )}
        >
          <Filter className="h-3 w-3 mr-1" />
          {triggerText}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-0" 
        align="start"
        side="bottom"
      >
        <div className="p-4" ref={filterRef}>
          <OptimizedValuesFilter options={options} />
        </div>
      </PopoverContent>
    </Popover>
  );
});

OptimizedScheduleColumnFilter.displayName = 'OptimizedScheduleColumnFilter';

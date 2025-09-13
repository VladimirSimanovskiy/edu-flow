import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '../../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { cn } from '../../../utils/cn';
import { scheduleConfigRegistry } from '../registry/schedule-config-registry';
import type { ScheduleType } from '../../../types/scheduleConfig';

interface ScheduleTypeSelectorProps {
  scheduleType: ScheduleType;
  onChange: (type: ScheduleType) => void;
  disabled?: boolean;
  className?: string;
}

export const ScheduleTypeSelector: React.FC<ScheduleTypeSelectorProps> = ({
  scheduleType,
  onChange,
  disabled = false,
  className
}) => {
  const [open, setOpen] = useState(false);
  const currentType = scheduleConfigRegistry.getMetadata(scheduleType);
  const allTypes = scheduleConfigRegistry.getAllMetadata();

  const handleSelect = (type: ScheduleType) => {
    onChange(type);
    setOpen(false);
  };

  if (!currentType) {
    return null;
  }

  const IconComponent = currentType.icon;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'justify-between min-w-[140px] h-9',
            className
          )}
          disabled={disabled}
        >
          <div className="flex items-center gap-2">
            <IconComponent className="w-4 h-4" />
            <span className="hidden sm:inline">{currentType.label}</span>
            <span className="sm:hidden">{currentType.shortLabel}</span>
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[160px] p-0" align="start">
        <div className="py-1">
          {allTypes.map((type) => {
            const TypeIcon = type.icon;
            const isSelected = type.id === scheduleType;
            
            return (
              <button
                key={type.id}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-100 transition-colors',
                  isSelected && 'bg-gray-50'
                )}
                onClick={() => handleSelect(type.id as ScheduleType)}
              >
                <TypeIcon className="w-4 h-4" />
                <span className="font-medium">{type.label}</span>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

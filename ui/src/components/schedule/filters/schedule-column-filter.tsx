import { useState, useRef } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Button } from "../../ui/button";
import { ValuesFilter } from "../../ui/values-filter";
import { Filter } from "lucide-react";
import { cn } from "../../../utils/cn";
import type {
  ValuesFilterOptions,
  ItemValue,
} from "../../../types/valuesFilter";

export interface ScheduleColumnFilterProps<T extends ItemValue> {
  options: ValuesFilterOptions<T>;
  isActive?: boolean;
  className?: string;
  triggerText?: string;
}

export const ScheduleColumnFilter = <T extends ItemValue>({
  options,
  isActive = false,
  className
}: ScheduleColumnFilterProps<T>) => {
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
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start" side="bottom">
        <div className="p-4" ref={filterRef}>
          <ValuesFilter options={options} />
        </div>
      </PopoverContent>
    </Popover>
  );
};

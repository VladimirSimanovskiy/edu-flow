import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Toolbar, ToolbarSeparator } from '@/components/ui';
import { DateNavigation } from '../../toolbar/date-navigation';
import { ScheduleTypeSelector } from '../../toolbar/schedule-type-selector';
import type { ScheduleType } from '@/types/scheduleConfig';
import { cn } from '@/lib/utils';

interface ScheduleToolbarProps {
	value: Date;
	onChange: (date: Date) => void;
	viewType: 'day' | 'week';
	onViewTypeChange: (viewType: 'day' | 'week') => void;
	scheduleType?: ScheduleType;
	onScheduleTypeChange?: (type: ScheduleType) => void;
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
	scheduleType,
	onScheduleTypeChange,
	className,
	disabled = false,
	minDate,
	maxDate,
	locale = 'ru',
}) => {
	return (
		<Toolbar className={cn('flex-col sm:flex-row w-full', className)}>
			{scheduleType && onScheduleTypeChange && (
				<ScheduleTypeSelector
					scheduleType={scheduleType}
					onChange={onScheduleTypeChange}
					disabled={disabled}
					className="w-full sm:w-auto"
				/>
			)}
			<ToolbarSeparator />
			<ToggleGroup
				type="single"
				value={viewType}
				onValueChange={(value: string) =>
					!disabled && value && onViewTypeChange(value as 'day' | 'week')
				}
				disabled={disabled}
				variant="outline"
				size="sm"
				className="w-full sm:w-auto"
			>
				<ToggleGroupItem value="day">День</ToggleGroupItem>
				<ToggleGroupItem value="week">Неделя</ToggleGroupItem>
			</ToggleGroup>
			<DateNavigation
				className="w-full sm:w-auto sm:ml-auto justify-between"
				value={value}
				viewType={viewType}
				onChange={onChange}
				disabled={disabled}
				minDate={minDate}
				maxDate={maxDate}
				locale={locale}
			/>
		</Toolbar>
	);
};

export default ScheduleToolbar;

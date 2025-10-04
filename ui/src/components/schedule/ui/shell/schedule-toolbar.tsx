import React from 'react';
import { cn } from '@/utils/cn';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { DateNavigation } from '../../toolbar/date-navigation';
import { ScheduleTypeSelector } from '../../toolbar/schedule-type-selector';
import type { ScheduleType } from '@/types/scheduleConfig';

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
		<div className={cn('w-full', className)}>
			{/* Mobile Layout - Stack vertically on small screens */}
			<div className="flex flex-col gap-3 sm:hidden">
				{/* Top row - Schedule Type and View Toggle */}
				<div className="flex items-center justify-between">
					{scheduleType && onScheduleTypeChange && (
						<ScheduleTypeSelector
							scheduleType={scheduleType}
							onChange={onScheduleTypeChange}
							disabled={disabled}
						/>
					)}
					<ToggleGroup
						type="single"
						value={viewType}
						onValueChange={(value: string | undefined) =>
							!disabled && value && onViewTypeChange(value as 'day' | 'week')
						}
						disabled={disabled}
						variant="outline"
						size="sm"
						className="inline-flex rounded-lg border p-0.5 bg-background"
					>
						<ToggleGroupItem value="day">
							<span className="whitespace-nowrap">День</span>
						</ToggleGroupItem>
						<ToggleGroupItem value="week">
							<span className="whitespace-nowrap">Неделя</span>
						</ToggleGroupItem>
					</ToggleGroup>
				</div>

				{/* Bottom row - Date Navigation */}
				<div className="flex items-center justify-center">
					<DateNavigation
						value={value}
						viewType={viewType}
						onChange={onChange}
						disabled={disabled}
						minDate={minDate}
						maxDate={maxDate}
						locale={locale}
					/>
				</div>
			</div>

			{/* Desktop Layout - Horizontal layout on larger screens */}
			<div className="hidden sm:flex items-center justify-between w-full">
				{/* Left Zone - Schedule Type Selector and View Toggle */}
				<div className="flex items-center gap-4">
					{scheduleType && onScheduleTypeChange && (
						<ScheduleTypeSelector
							scheduleType={scheduleType}
							onChange={onScheduleTypeChange}
							disabled={disabled}
						/>
					)}
					<ToggleGroup
						type="single"
						value={viewType}
						onValueChange={(value: string | undefined) =>
							!disabled && value && onViewTypeChange(value as 'day' | 'week')
						}
						disabled={disabled}
						variant="outline"
						size="sm"
						className="inline-flex rounded-lg border p-0.5 bg-background"
					>
						<ToggleGroupItem
							value="day"
							className={cn(
								'px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all border-0 h-8 min-w-[3rem] sm:min-w-[4rem]',
								viewType === 'day'
									? 'bg-primary text-primary-foreground shadow-sm hover:bg-primary-600'
									: 'bg-transparent hover:bg-primary-50 hover:text-primary-700 active:bg-primary-100'
							)}
						>
							<span className="whitespace-nowrap">День</span>
						</ToggleGroupItem>
						<ToggleGroupItem
							value="week"
							className={cn(
								'px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all border-0 h-8 min-w-[3rem] sm:min-w-[4rem]',
								viewType === 'week'
									? 'bg-primary text-primary-foreground shadow-sm hover:bg-primary-600'
									: 'bg-transparent hover:bg-primary-50 hover:text-primary-700 active:bg-primary-100'
							)}
						>
							<span className="whitespace-nowrap">Неделя</span>
						</ToggleGroupItem>
					</ToggleGroup>
				</div>

				{/* Right Zone - Date Navigation */}
				<div className="flex items-center">
					<DateNavigation
						value={value}
						viewType={viewType}
						onChange={onChange}
						disabled={disabled}
						minDate={minDate}
						maxDate={maxDate}
						locale={locale}
					/>
				</div>
			</div>
		</div>
	);
};

export default ScheduleToolbar;

import React from 'react';
import { cn } from '@/utils/cn';
import { ViewToggle } from '@/components/ui/view-toggle';
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
					<ViewToggle
						viewType={viewType}
						onChange={onViewTypeChange}
						disabled={disabled}
					/>
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
					<ViewToggle
						viewType={viewType}
						onChange={onViewTypeChange}
						disabled={disabled}
					/>
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

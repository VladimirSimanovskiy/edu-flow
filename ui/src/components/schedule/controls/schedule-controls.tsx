import React from 'react';
import { Card, CardContent } from '../../ui/card';
import { ScheduleToolbar } from '../schedule-toolbar';
import type { ScheduleType } from '../../../types/scheduleConfig';

interface ScheduleControlsProps {
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

export const ScheduleControls: React.FC<ScheduleControlsProps> = ({
	value,
	onChange,
	viewType,
	onViewTypeChange,
	scheduleType,
	onScheduleTypeChange,
	disabled = false,
	minDate,
	maxDate,
	locale = 'ru',
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
						scheduleType={scheduleType}
						onScheduleTypeChange={onScheduleTypeChange}
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

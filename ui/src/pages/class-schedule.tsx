import React from 'react';
import ScheduleView from '../components/schedule/ui/shell/schedule-view';

export const ClassSchedule: React.FC = () => {
	return (
		<div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 max-w-7xl">
			<ScheduleView type="classes" />
		</div>
	);
};

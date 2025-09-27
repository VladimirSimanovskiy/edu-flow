import React, { useState } from 'react';
import { ScheduleView } from '../components/schedule';
import type { ScheduleType } from '../types/scheduleConfig';

export const Schedule: React.FC = () => {
	const [scheduleType, setScheduleType] = useState<ScheduleType>('teachers');

	return (
		<div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 max-w-7xl">
			<ScheduleView type={scheduleType} onScheduleTypeChange={setScheduleType} />
		</div>
	);
};

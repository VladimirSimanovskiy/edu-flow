import React from 'react';
import { startOfWeek } from 'date-fns';
import { useScheduleStore } from '../../store';
import { useScheduleConfig, renderScheduleComponent } from '../../schedule-component-factory';
import { ScheduleDataProvider, useScheduleData } from '../../api';
import { ScheduleLayout } from './schedule-layout';
import { ScheduleToolbar } from './schedule-toolbar';
import { ScheduleLoadingProgress } from '../../schedule-loading-progress';
import { useScheduleLoadingProgress } from '../../hooks';
import { ScheduleLoadingUtils } from '@/types/scheduleLoading';
import { ScheduleFiltersProvider } from '../../filters/context/ScheduleFiltersContext';
import type { ScheduleType } from '@/types/scheduleConfig';

interface ScheduleViewProps {
	type: ScheduleType;
	onScheduleTypeChange?: (type: ScheduleType) => void;
}

const ScheduleViewContent: React.FC<{
	type: ScheduleType;
	onScheduleTypeChange?: (type: ScheduleType) => void;
}> = ({ type, onScheduleTypeChange }) => {
	const { currentView, setDate, setViewType } = useScheduleStore();
	const scheduleConfig = useScheduleConfig(type);
	const { teachers, classes, lessons, loadingState } = useScheduleData();

	const { progressState } = useScheduleLoadingProgress(loadingState);

	const handleDateChange = (date: Date) => {
		setDate(date);
	};

	const handleViewTypeChange = (viewType: 'day' | 'week') => {
		setViewType(viewType);
	};

	const weekStart = startOfWeek(currentView.date, { weekStartsOn: 1 });

	return (
		<ScheduleLayout
			title={scheduleConfig.title}
			description={scheduleConfig.description}
			error={ScheduleLoadingUtils.hasError(loadingState) ? loadingState.error : null}
		>
			{/* Controls */}
			<ScheduleToolbar
				value={currentView.date}
				onChange={handleDateChange}
				viewType={currentView.type}
				onViewTypeChange={handleViewTypeChange}
				scheduleType={type}
				onScheduleTypeChange={onScheduleTypeChange}
				disabled={!ScheduleLoadingUtils.isInteractive(loadingState)}
			/>

			{/* Schedule Content */}
			<div className="relative">
				{/* Progress Bar */}
				<ScheduleLoadingProgress state={progressState} position="top" />

				{renderScheduleComponent(type, currentView.type, {
					teachers,
					classes,
					lessons,
					date: currentView.date,
					weekStart: currentView.type === 'week' ? weekStart : undefined,
				})}
			</div>
		</ScheduleLayout>
	);
};

const ScheduleView: React.FC<ScheduleViewProps> = ({ type, onScheduleTypeChange }) => {
	const { currentView } = useScheduleStore();

	return (
		<ScheduleFiltersProvider>
			<ScheduleDataProvider date={currentView.date} viewType={currentView.type}>
				<ScheduleViewContent type={type} onScheduleTypeChange={onScheduleTypeChange} />
			</ScheduleDataProvider>
		</ScheduleFiltersProvider>
	);
};

export default ScheduleView;

import React from 'react';
import { startOfWeek } from 'date-fns';
import { useScheduleStore } from '../../store/scheduleStore';
import { useScheduleConfig, renderScheduleComponent } from './schedule-component-factory';
import { ScheduleDataProvider, useScheduleData } from './data/schedule-data-provider';
import { ScheduleLayout } from './layout/schedule-layout';
import { ScheduleControls } from './controls/schedule-controls';
import type { ScheduleType } from '../../types/scheduleConfig';

interface ScheduleViewProps {
  type: ScheduleType;
  onScheduleTypeChange?: (type: ScheduleType) => void;
}

const ScheduleViewContent: React.FC<{ type: ScheduleType; onScheduleTypeChange?: (type: ScheduleType) => void }> = ({ type, onScheduleTypeChange }) => {
  const { currentView, setDate, setViewType } = useScheduleStore();
  const scheduleConfig = useScheduleConfig(type);
  const { teachers, classes, lessons, isLoading, error } = useScheduleData();

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
      isLoading={isLoading}
      error={error}
    >
      {/* Controls */}
      <ScheduleControls
        value={currentView.date}
        onChange={handleDateChange}
        viewType={currentView.type}
        onViewTypeChange={handleViewTypeChange}
        scheduleType={type}
        onScheduleTypeChange={onScheduleTypeChange}
      />

      {/* Schedule Content */}
      <div>
        {renderScheduleComponent(
          type,
          currentView.type,
          {
            teachers,
            classes,
            lessons,
            date: currentView.date,
            weekStart: currentView.type === 'week' ? weekStart : undefined,
          }
        )}
      </div>
    </ScheduleLayout>
  );
};

export const ScheduleView: React.FC<ScheduleViewProps> = ({ type, onScheduleTypeChange }) => {
  const { currentView } = useScheduleStore();

  return (
    <ScheduleDataProvider
      date={currentView.date}
      viewType={currentView.type}
    >
      <ScheduleViewContent type={type} onScheduleTypeChange={onScheduleTypeChange} />
    </ScheduleDataProvider>
  );
};

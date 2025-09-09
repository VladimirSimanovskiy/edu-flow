import React from 'react';
import { ScheduleView } from '../components/schedule/schedule-view';

export const ClassSchedule: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <ScheduleView type="classes" />
    </div>
  );
};

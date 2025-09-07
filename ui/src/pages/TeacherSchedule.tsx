import React from 'react';
import { ScheduleView } from '../components/schedule/ScheduleView';

export const TeacherSchedule: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <ScheduleView type="teachers" />
    </div>
  );
};

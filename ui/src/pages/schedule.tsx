import React, { useState } from 'react';
import { ScheduleView } from '../components/schedule/schedule-view';
import type { ScheduleType } from '../types/scheduleConfig';

export const Schedule: React.FC = () => {
  const [scheduleType, setScheduleType] = useState<ScheduleType>('teachers');

  return (
    <div className="container mx-auto px-4 py-6">
      <ScheduleView 
        type={scheduleType} 
        onScheduleTypeChange={setScheduleType}
      />
    </div>
  );
};

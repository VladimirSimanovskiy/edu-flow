import React from 'react';
import { startOfWeek } from 'date-fns';
import { useScheduleStore } from '../../store/scheduleStore';
import { useTeachers, useClasses, useLessonsForWeek, useLessonsForDay } from '../../hooks/useSchedule';
import { DatePicker } from '../ui/DatePicker';
import { ViewToggle } from '../ui/ViewToggle';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ErrorMessage } from '../ui/ErrorMessage';
import { useScheduleConfig, renderScheduleComponent } from './ScheduleComponentFactory';
import type { ScheduleType } from '../../types/scheduleConfig';
import { useScheduleDate } from '../../hooks/useScheduleDate';

interface ScheduleViewProps {
  type: ScheduleType;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({ type }) => {
  const { currentView, setDate, setViewType } = useScheduleStore();
  const scheduleConfig = useScheduleConfig(type);
  const { apiDateString } = useScheduleDate(currentView.date);

  // Загружаем данные из API
  const { data: teachers, isLoading: teachersLoading, error: teachersError } = useTeachers();
  const { data: classes, isLoading: classesLoading, error: classesError } = useClasses();
  
  // Всегда вызываем оба хука, но включаем только нужный
  const { data: dayLessons, isLoading: dayLessonsLoading, error: dayLessonsError } = useLessonsForDay(
    apiDateString,
    undefined,
    { enabled: currentView.type === 'day' }
  );
  
  const { data: weekLessons, isLoading: weekLessonsLoading, error: weekLessonsError } = useLessonsForWeek(
    apiDateString,
    undefined,
    { enabled: currentView.type === 'week' }
  );
  
  // Используем соответствующие данные в зависимости от типа представления
  const lessons = currentView.type === 'day' ? dayLessons : weekLessons;
  const lessonsLoading = currentView.type === 'day' ? dayLessonsLoading : weekLessonsLoading;
  const lessonsError = currentView.type === 'day' ? dayLessonsError : weekLessonsError;


  const handleDateChange = (date: Date) => {
    setDate(date);
  };

  const handleViewTypeChange = (viewType: 'day' | 'week') => {
    setViewType(viewType);
  };


  const weekStart = startOfWeek(currentView.date, { weekStartsOn: 1 });

  // Показываем загрузку
  if (teachersLoading || classesLoading || lessonsLoading) {
    return <LoadingSpinner />;
  }

  // Показываем ошибки
  if (teachersError || classesError || lessonsError) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">
          {scheduleConfig.title}
        </h1>
        {teachersError && <ErrorMessage error={`Ошибка загрузки учителей: ${teachersError.message}`} />}
        {classesError && <ErrorMessage error={`Ошибка загрузки классов: ${classesError.message}`} />}
        {lessonsError && <ErrorMessage error={`Ошибка загрузки уроков: ${lessonsError.message}`} />}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {scheduleConfig.title}
          </h1>
          <p className="text-gray-600">
            {scheduleConfig.description}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex items-center gap-4">
          <ViewToggle
            viewType={currentView.type}
            onChange={handleViewTypeChange}
          />
        </div>
        
        <DatePicker
          value={currentView.date}
          onChange={handleDateChange}
          viewType={currentView.type}
        />
      </div>

      {/* Schedule Content */}
      {renderScheduleComponent(
        type,
        currentView.type,
        {
          teachers: teachers || [],
          classes: classes || [],
          lessons: lessons || [],
          date: currentView.date,
          weekStart: currentView.type === 'week' ? weekStart : undefined,
        }
      )}
    </div>
  );
};

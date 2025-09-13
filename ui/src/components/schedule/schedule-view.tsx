import React from 'react';
import { startOfWeek } from 'date-fns';
import { useScheduleStore } from '../../store/scheduleStore';
import { useTeachers, useClasses, useLessonsForWeek, useLessonsForDay } from '../../hooks/useSchedule';
import { DatePicker } from '../ui/date-picker';
import { ViewToggle } from '../ui/view-toggle';
import { LoadingSpinner } from '../ui/loading-spinner';
import { ErrorMessage } from '../ui/error-message';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { useScheduleConfig, renderScheduleComponent } from './schedule-component-factory';
import type { ScheduleType } from '../../types/scheduleConfig';
import { useScheduleDate } from '../../hooks/useScheduleDate';
import { tokens } from '../../design-system/tokens';

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
    return (
      <div style={{ padding: tokens.spacing[8] }}>
        <LoadingSpinner 
          size="lg" 
          text="Загрузка расписания..." 
        />
      </div>
    );
  }

  // Показываем ошибки
  if (teachersError || classesError || lessonsError) {
    return (
      <div style={{ padding: tokens.spacing[6] }}>
        <Card className="border shadow-none">
          <CardHeader>
            <CardTitle>{scheduleConfig.title}</CardTitle>
            <CardDescription>{scheduleConfig.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[4] }}>
              {teachersError && (
                <ErrorMessage 
                  error={`Ошибка загрузки учителей: ${teachersError.message}`}
                  variant="banner"
                />
              )}
              {classesError && (
                <ErrorMessage 
                  error={`Ошибка загрузки классов: ${classesError.message}`}
                  variant="banner"
                />
              )}
              {lessonsError && (
                <ErrorMessage 
                  error={`Ошибка загрузки уроков: ${lessonsError.message}`}
                  variant="banner"
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-4 sm:gap-6">
      {/* Header */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">
            {scheduleConfig.title}
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            {scheduleConfig.description}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Controls */}
      <Card className="border shadow-none">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <ViewToggle
              viewType={currentView.type}
              onChange={handleViewTypeChange}
            />
            
            <DatePicker
              value={currentView.date}
              onChange={handleDateChange}
              viewType={currentView.type}
            />
          </div>
        </CardContent>
      </Card>

      {/* Schedule Content */}
      <div>
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
    </div>
  );
};

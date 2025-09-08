import React from 'react';
import { startOfWeek } from 'date-fns';
import { useScheduleStore } from '../../store/scheduleStore';
import { useTeachers, useClasses, useLessonsForWeek } from '../../hooks/useSchedule';
import { TeacherScheduleTable } from './TeacherScheduleTable';
import { ClassScheduleTable } from './ClassScheduleTable';
import { TeacherDaySchedule } from './TeacherDaySchedule';
import { ClassDaySchedule } from './ClassDaySchedule';
import { DatePicker } from '../ui/DatePicker';
import { ViewToggle } from '../ui/ViewToggle';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ErrorMessage } from '../ui/ErrorMessage';


interface ScheduleViewProps {
  type: 'teachers' | 'classes';
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({ type }) => {
  const { currentView, setDate, setViewType } = useScheduleStore();

  // Загружаем данные из API
  const { data: teachers, isLoading: teachersLoading, error: teachersError } = useTeachers();
  const { data: classes, isLoading: classesLoading, error: classesError } = useClasses();
  const { data: lessons, isLoading: lessonsLoading, error: lessonsError } = useLessonsForWeek(
    currentView.date.toISOString().split('T')[0] // YYYY-MM-DD format
  );

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
          {type === 'teachers' ? 'Расписание учителей' : 'Расписание классов'}
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
            {type === 'teachers' ? 'Расписание учителей' : 'Расписание классов'}
          </h1>
          <p className="text-gray-600">
            {type === 'teachers' 
              ? 'Просмотр расписания преподавателей' 
              : 'Просмотр расписания учебных классов'
            }
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
      {type === 'teachers' ? (
        currentView.type === 'day' ? (
          <TeacherDaySchedule
            teachers={teachers || []}
            departments={[]} // TODO: Добавить загрузку департаментов
            lessons={lessons || []}
            date={currentView.date}
          />
        ) : (
          <TeacherScheduleTable
            teachers={teachers || []}
            departments={[]} // TODO: Добавить загрузку департаментов
            lessons={lessons || []}
            weekStart={weekStart}
          />
        )
      ) : (
        currentView.type === 'day' ? (
          <ClassDaySchedule
            classes={classes || []}
            lessons={lessons || []}
            date={currentView.date}
          />
        ) : (
          <ClassScheduleTable
            classes={classes || []}
            lessons={lessons || []}
            weekStart={weekStart}
          />
        )
      )}
    </div>
  );
};

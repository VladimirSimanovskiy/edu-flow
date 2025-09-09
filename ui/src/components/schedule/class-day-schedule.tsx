import React from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import type { Class, Lesson } from '../../types/schedule';
import { useLessonNumbers } from '../../hooks/useLessonNumbers';
import { useScheduleLogic } from '../../hooks/useScheduleLogic';
import { ScheduleContainer } from './base/schedule-container';
import { 
  ScheduleTable,
  ScheduleTableHeader,
  ScheduleTableBody,
  ScheduleTableRow,
  ScheduleTableCell
} from './base/schedule-table';
import { LessonHeader } from './base/lesson-header';
import { LessonGrid } from './base/lesson-grid';

interface ClassDayScheduleProps {
  classes: Class[];
  lessons: Lesson[];
  date: Date;
  className?: string;
}

export const ClassDaySchedule: React.FC<ClassDayScheduleProps> = ({
  classes,
  lessons,
  date,
  className,
}) => {
  const { lessonNumbers, isLoading: lessonNumbersLoading } = useLessonNumbers();
  const { getLessonForClass, getDayOfWeek } = useScheduleLogic(lessons);

  const dayOfWeek = getDayOfWeek(date);
  const formattedDate = format(date, 'EEEE, d MMMM yyyy', { locale: ru });

  const getLesson = (classId: number, lessonNumber: number) => {
    return getLessonForClass(classId, dayOfWeek, lessonNumber);
  };

  return (
    <ScheduleContainer
      className={className}
      title={formattedDate}
      loading={lessonNumbersLoading}
      loadingText="Загрузка расписания уроков..."
    >
      <ScheduleTable>
        <ScheduleTableHeader>
          <ScheduleTableRow className="bg-gray-50">
            <ScheduleTableCell header width="w-24 sm:w-32 md:w-48" className="border-r sticky left-0 bg-gray-50 z-20">
              <span className="hidden sm:inline">Классы</span>
              <span className="sm:hidden">Кл.</span>
            </ScheduleTableCell>
            <ScheduleTableCell header className="text-center p-0.5 sm:p-1 md:p-2">
              <LessonHeader lessonNumbers={lessonNumbers} />
            </ScheduleTableCell>
          </ScheduleTableRow>
        </ScheduleTableHeader>
        
        <ScheduleTableBody>
          {classes.map((classItem) => (
            <ScheduleTableRow key={classItem.id}>
              <ScheduleTableCell className="border-r sticky left-0 bg-white z-10">
                <div className="font-medium text-gray-900 text-xs sm:text-sm">
                  {classItem.name}
                </div>
              </ScheduleTableCell>
              <ScheduleTableCell className="p-0 sm:p-0.5 md:p-1">
                <LessonGrid
                  lessonNumbers={lessonNumbers}
                  getLesson={(lessonNumber) => getLesson(classItem.id, lessonNumber)}
                />
              </ScheduleTableCell>
            </ScheduleTableRow>
          ))}
        </ScheduleTableBody>
      </ScheduleTable>
    </ScheduleContainer>
  );
};

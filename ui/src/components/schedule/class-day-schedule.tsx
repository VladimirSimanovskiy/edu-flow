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
            <ScheduleTableCell header width="w-48" className="border-r">
              Классы
            </ScheduleTableCell>
            <ScheduleTableCell header className="text-center p-2">
              <LessonHeader lessonNumbers={lessonNumbers} />
            </ScheduleTableCell>
          </ScheduleTableRow>
          <ScheduleTableRow className="bg-gray-50">
            <ScheduleTableCell header width="w-48" className="border-r">
              Класс
            </ScheduleTableCell>
            <ScheduleTableCell header className="text-center p-1 text-xs text-gray-500">
              Номера уроков
            </ScheduleTableCell>
          </ScheduleTableRow>
        </ScheduleTableHeader>
        
        <ScheduleTableBody>
          {classes.map((classItem) => (
            <ScheduleTableRow key={classItem.id}>
              <ScheduleTableCell className="border-r">
                <div className="font-medium text-gray-900">
                  {classItem.name}
                </div>
              </ScheduleTableCell>
              <ScheduleTableCell className="p-1">
                <LessonGrid
                  lessonNumbers={lessonNumbers}
                  getLesson={(lessonNumber) => getLesson(classItem.id, lessonNumber)}
                  variant="class"
                />
              </ScheduleTableCell>
            </ScheduleTableRow>
          ))}
        </ScheduleTableBody>
      </ScheduleTable>
    </ScheduleContainer>
  );
};

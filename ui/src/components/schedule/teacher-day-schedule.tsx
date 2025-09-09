import React from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import type { Teacher, Lesson } from '../../types/schedule';
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

interface TeacherDayScheduleProps {
  teachers: Teacher[];
  lessons: Lesson[];
  date: Date;
  className?: string;
}

export const TeacherDaySchedule: React.FC<TeacherDayScheduleProps> = ({
  teachers,
  lessons,
  date,
  className,
}) => {
  const { lessonNumbers, isLoading: lessonNumbersLoading } = useLessonNumbers();
  const { getLessonForTeacher, getDayOfWeek } = useScheduleLogic(lessons);

  const dayOfWeek = getDayOfWeek(date);
  const formattedDate = format(date, 'EEEE, d MMMM yyyy', { locale: ru });

  const getLesson = (teacherId: number, lessonNumber: number) => {
    return getLessonForTeacher(teacherId, dayOfWeek, lessonNumber);
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
              Учителя
            </ScheduleTableCell>
            <ScheduleTableCell header className="text-center p-2">
              <LessonHeader lessonNumbers={lessonNumbers} />
            </ScheduleTableCell>
          </ScheduleTableRow>
        </ScheduleTableHeader>
        
        <ScheduleTableBody>
          {teachers.map((teacher) => (
            <ScheduleTableRow key={teacher.id}>
              <ScheduleTableCell className="border-r">
                <div className="font-medium text-gray-900">
                  {teacher.fullName}
                </div>
                <div className="text-xs text-gray-500">
                  {teacher.subjectNames.join(', ')}
                </div>
              </ScheduleTableCell>
              <ScheduleTableCell className="p-1">
                <LessonGrid
                  lessonNumbers={lessonNumbers}
                  getLesson={(lessonNumber) => getLesson(teacher.id, lessonNumber)}
                  variant="teacher"
                />
              </ScheduleTableCell>
            </ScheduleTableRow>
          ))}
        </ScheduleTableBody>
      </ScheduleTable>
    </ScheduleContainer>
  );
};

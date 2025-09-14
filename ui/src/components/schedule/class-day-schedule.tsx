import React from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import type { Class, Lesson } from '../../types/schedule';
import { useLessonNumbers, useScheduleLogic } from './hooks';
import { useScheduleFiltersContext } from './filters';
import { useClassScheduleStore } from '../../store/classScheduleStore';
import type { LessonData } from './base/lesson-cell';
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
import { ScheduleColumnFilter } from './filters';

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
  const { highlight, setHighlightedTeacher, clearHighlight } = useClassScheduleStore();
  
  // Get filters from context
  const {
    getClassFilterOptions,
    isClassFilterActive,
    isClassVisible,
  } = useScheduleFiltersContext();
  
  const classFilterOptions = getClassFilterOptions(classes);

  const dayOfWeek = getDayOfWeek(date);
  const formattedDate = format(date, 'EEEE, d MMMM yyyy', { locale: ru });

  // Filter classes based on filter state
  const filteredClasses = classes.filter(classItem => isClassVisible(classItem.id));

  const getLesson = (classId: number, lessonNumber: number) => {
    return getLessonForClass(classId, dayOfWeek, lessonNumber);
  };

  // Обработчик клика по уроку в расписании классов
  const handleLessonClick = (classId: number, lessonNumber: number, _lesson: LessonData) => {
    // Находим урок и извлекаем ID учителя
    const lessonData = lessons.find(l => 
      l.idClass === classId && 
      l.dayOfWeek === dayOfWeek &&
      l.lessonNumber === lessonNumber
    );

    if (!lessonData) {
      return;
    }

    const teacherId = lessonData.idTeacher;
    const currentHighlightedTeacherId = highlight.highlightedTeacherId;

    // Если кликнули по тому же учителю - снимаем подсветку
    if (currentHighlightedTeacherId === teacherId) {
      clearHighlight();
    } else {
      // Иначе подсвечиваем нового учителя
      setHighlightedTeacher(teacherId, date);
    }
  };

  // Проверка, должен ли урок быть подсвечен
  const isLessonHighlighted = (classId: number, lessonNumber: number, _lesson: LessonData): boolean => {
    if (!highlight.highlightedTeacherId) return false;

    // Находим урок и проверяем, что это тот же учитель
    const lessonData = lessons.find(l => 
      l.idClass === classId && 
      l.dayOfWeek === dayOfWeek &&
      l.lessonNumber === lessonNumber
    );

    return lessonData ? lessonData.idTeacher === highlight.highlightedTeacherId : false;
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
            <ScheduleTableCell 
              header 
              width="w-24 sm:w-32 md:w-48" 
              className="border-r sticky left-0 bg-gray-50 z-20"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="hidden sm:inline">Классы</span>
                  <span className="sm:hidden">Кл.</span>
                </div>
                <ScheduleColumnFilter
                  options={classFilterOptions}
                  isActive={isClassFilterActive}
                  triggerText=""
                  className="ml-2"
                />
              </div>
            </ScheduleTableCell>
            <ScheduleTableCell header className="text-center p-0.5 sm:p-1 md:p-2">
              <LessonHeader lessonNumbers={lessonNumbers} />
            </ScheduleTableCell>
          </ScheduleTableRow>
        </ScheduleTableHeader>
        
        <ScheduleTableBody>
          {filteredClasses.map((classItem) => (
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
                  onLessonClick={(lessonNumber, lesson) => handleLessonClick(classItem.id, lessonNumber, lesson)}
                  isLessonHighlighted={(lessonNumber, lesson) => isLessonHighlighted(classItem.id, lessonNumber, lesson)}
                />
              </ScheduleTableCell>
            </ScheduleTableRow>
          ))}
        </ScheduleTableBody>
      </ScheduleTable>
    </ScheduleContainer>
  );
};

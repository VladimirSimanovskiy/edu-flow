import React from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import type { Teacher, Lesson } from '../../types/schedule';
import { useLessonNumbers } from '../../hooks/useLessonNumbers';
import { useScheduleLogic } from '../../hooks/useScheduleLogic';
import { useTeacherScheduleStore } from '../../store/teacherScheduleStore';
import type { LessonData } from './base/lesson-cell';

// Функция для сокращения ФИО в формат "Иванов А.Д."
const shortenTeacherName = (fullName: string): string => {
  const parts = fullName.trim().split(' ');
  if (parts.length < 3) return fullName; // Если не полное ФИО, возвращаем как есть
  
  // Порядок в fullName: Имя Фамилия Отчество
  const firstName = parts[0];
  const lastName = parts[1];
  const middleName = parts[2];
  
  const firstInitial = firstName.charAt(0).toUpperCase();
  const middleInitial = middleName.charAt(0).toUpperCase();
  
  return `${lastName} ${firstInitial}.${middleInitial}.`;
};
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
  const { highlight, setHighlightedClass, clearHighlight } = useTeacherScheduleStore();

  const dayOfWeek = getDayOfWeek(date);
  const formattedDate = format(date, 'EEEE, d MMMM yyyy', { locale: ru });

  const getLesson = (teacherId: number, lessonNumber: number) => {
    return getLessonForTeacher(teacherId, dayOfWeek, lessonNumber);
  };

  // Обработчик клика по уроку в расписании учителей
  const handleLessonClick = (teacherId: number, lessonNumber: number, _lesson: LessonData) => {
    // Находим урок и извлекаем ID класса
    const lessonData = lessons.find(l => 
      l.idTeacher === teacherId && 
      l.dayOfWeek === dayOfWeek &&
      l.lessonNumber === lessonNumber
    );

    if (!lessonData) {
      return;
    }

    const classId = lessonData.idClass;
    const currentHighlightedClassId = highlight.highlightedClassId;

    // Если кликнули по тому же классу - снимаем подсветку
    if (currentHighlightedClassId === classId) {
      clearHighlight();
    } else {
      // Иначе подсвечиваем новый класс
      setHighlightedClass(classId, date);
    }
  };

  // Проверка, должен ли урок быть подсвечен
  const isLessonHighlighted = (teacherId: number, lessonNumber: number, _lesson: LessonData): boolean => {
    if (!highlight.highlightedClassId) return false;

    // Находим урок и проверяем, что это тот же класс
    const lessonData = lessons.find(l => 
      l.idTeacher === teacherId && 
      l.dayOfWeek === dayOfWeek &&
      l.lessonNumber === lessonNumber
    );

    return lessonData ? lessonData.idClass === highlight.highlightedClassId : false;
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
              <span className="sm:inline">Учителя</span>
            </ScheduleTableCell>
            <ScheduleTableCell header className="text-center p-0.5 sm:p-1 md:p-2">
              <LessonHeader lessonNumbers={lessonNumbers} />
            </ScheduleTableCell>
          </ScheduleTableRow>
        </ScheduleTableHeader>
        
        <ScheduleTableBody>
          {teachers.map((teacher) => (
            <ScheduleTableRow key={teacher.id}>
              <ScheduleTableCell className="border-r sticky left-0 bg-white z-10">
                <div className="font-medium text-gray-900 text-xs sm:text-sm">
                  {shortenTeacherName(teacher.fullName)}
                </div>
                <div className="text-xs text-gray-500 hidden sm:block">
                  {teacher.subjectNames.join(', ')}
                </div>
              </ScheduleTableCell>
              <ScheduleTableCell className="p-0 sm:p-0.5 md:p-1">
                <LessonGrid
                  lessonNumbers={lessonNumbers}
                  getLesson={(lessonNumber) => getLesson(teacher.id, lessonNumber)}
                  onLessonClick={(lessonNumber, lesson) => handleLessonClick(teacher.id, lessonNumber, lesson)}
                  isLessonHighlighted={(lessonNumber, lesson) => isLessonHighlighted(teacher.id, lessonNumber, lesson)}
                />
              </ScheduleTableCell>
            </ScheduleTableRow>
          ))}
        </ScheduleTableBody>
      </ScheduleTable>
    </ScheduleContainer>
  );
};

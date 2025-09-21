import React, { useState } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import type { Teacher, Lesson } from '../../types/schedule';
import { useLessonNumbers, useScheduleLogic } from './hooks';
import { useScheduleFiltersContext } from './filters';
import { useTeacherScheduleStore } from '../../store/teacherScheduleStore';
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
import { useSubstitutionHover } from './hooks/useSubstitutionHover';
import { CreateSubstitutionModal } from './modals/create-substitution-modal';
import { useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/api';

// Функция для сокращения ФИО в формат "Иванов А.Д."
const shortenTeacherName = (fullName: string): string => {
  const parts = fullName.trim().split(' ');
  if (parts.length < 3) return fullName;
  
  // Порядок в fullName: Имя Фамилия Отчество
  const firstName = parts[0];
  const lastName = parts[1];
  const middleName = parts[2];
  
  const firstInitial = firstName.charAt(0).toUpperCase();
  const middleInitial = middleName.charAt(0).toUpperCase();
  
  return `${lastName} ${firstInitial}.${middleInitial}.`;
};

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
  const { highlight, setHighlightedClass, clearHighlight, setHoverLinked, enterSubstitutionMode, exitSubstitutionMode } = useTeacherScheduleStore();
  const { onTeacherDayHoverChange, isTeacherDayHoverLinked } = useSubstitutionHover(lessons);
  
  // Get filters from context
  const {
    getTeacherFilterOptions,
    isTeacherFilterActive,
    isTeacherVisible,
  } = useScheduleFiltersContext();
  
  const teacherFilterOptions = getTeacherFilterOptions(teachers);

  const dayOfWeek = getDayOfWeek(date);
  const formattedDate = format(date, 'EEEE, d MMMM yyyy', { locale: ru });

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSubstituteTeacherId, setSelectedSubstituteTeacherId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  // Filter teachers based on filter state
  const filteredTeachers = teachers.filter(teacher => isTeacherVisible(teacher.id));

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

  // ПКМ-пункт: сразу включаем режим замещения и подсветку
  const handleLessonContextMenu = (teacherId: number, lessonNumber: number, lesson: LessonData) => {
    if (!lesson || lesson.isSubstitution || lesson.isReplacedOriginal) return;

    const lessonData = lessons.find(l => 
      l.idTeacher === teacherId && 
      l.dayOfWeek === dayOfWeek &&
      l.lessonNumber === lessonNumber
    );
    if (!lessonData) return;

    const freeTeacherIds = teachers
      .filter(t => {
        const hasOwnLesson = lessons.some(l => l.idTeacher === t.id && l.dayOfWeek === dayOfWeek && l.lessonNumber === lessonNumber);
        const hasSubstitution = lessons.some(l => l.dayOfWeek === dayOfWeek && l.lessonNumber === lessonNumber && l.substitution && l.substitution.idTeacher === t.id);
        return !hasOwnLesson && !hasSubstitution;
      })
      .map(t => t.id);

    const dateStr = new Date(date).toISOString().split('T')[0];
    enterSubstitutionMode({
      date: dateStr,
      lessonNumber,
      idOriginalLesson: lessonData.id,
      idOriginalTeacher: teacherId,
      classId: lessonData.idClass,
    }, freeTeacherIds);
  };

  // Удаление замещения через контекстное меню по замещению
  const handleDeleteSubstitution = async (teacherId: number, lessonNumber: number, lesson: LessonData) => {
    if (!lesson || !lesson.isSubstitution) return;

    // Находим урок, у которого есть это замещение для данного слота
    const base = lessons.find(l =>
      l.dayOfWeek === dayOfWeek &&
      l.lessonNumber === lessonNumber &&
      l.substitution && l.substitution.idTeacher === teacherId
    );
    const substitutionId = base?.substitution?.id;
    if (!substitutionId) return;

    await apiClient.deleteSubstitution(substitutionId);
    await queryClient.invalidateQueries({ queryKey: ["lessons"] });
  };

  // Проверка, должен ли урок быть подсвечен
  const isLessonHighlighted = (teacherId: number, lessonNumber: number, _lesson: LessonData): boolean => {
    // Подсветка свободных ячеек — только на выбранный номер урока (день у нас фиксирован этот компонент)
    if (highlight.substitutionMode) {
      if (lessonNumber !== highlight.substitutionMode.lessonNumber) return false;
    }

    // Hover связка для дня
    if (highlight.hoverLinked && highlight.hoverLinked.day === dayOfWeek && highlight.hoverLinked.lessonNumber === lessonNumber) {
      return teacherId === highlight.hoverLinked.originalTeacherId || teacherId === highlight.hoverLinked.substituteTeacherId;
    }

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
            <ScheduleTableCell 
              header 
              width="w-24 sm:w-32 md:w-48" 
              className="border-r sticky left-0 bg-gray-50 z-20"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="sm:inline">Учителя</span>
                </div>
                <ScheduleColumnFilter
                  options={teacherFilterOptions}
                  isActive={isTeacherFilterActive}
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
          {filteredTeachers.map((teacher) => (
            <ScheduleTableRow key={teacher.id}>
              <ScheduleTableCell className="border-r sticky left-0 bg-white z-10">
                <div className="font-medium text-gray-900 text-xs sm:text-sm">
                  {teacher.fullName.split(' ').length >= 2 ? `${teacher.fullName.split(' ')[1]} ${teacher.fullName.split(' ')[0].charAt(0)}.${(teacher.fullName.split(' ')[2] || '').charAt(0)}.` : teacher.fullName}
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
                  onLessonContextMenu={(lessonNumber, lsn) => handleLessonContextMenu(teacher.id, lessonNumber, lsn)}
                  onLessonDeleteSubstitution={(lessonNumber, lsn) => handleDeleteSubstitution(teacher.id, lessonNumber, lsn)}
                  isLessonHighlighted={(lessonNumber, lesson) => {
                    if (highlight.substitutionMode && highlight.freeTeacherIdsAtTimeslot) {
                      if (lessonNumber !== highlight.substitutionMode.lessonNumber) return false;
                      const hasOwn = lessons.some(l => l.idTeacher === teacher.id && l.dayOfWeek === dayOfWeek && l.lessonNumber === lessonNumber);
                      const hasSub = lessons.some(l => l.dayOfWeek === dayOfWeek && l.lessonNumber === lessonNumber && l.substitution && l.substitution.idTeacher === teacher.id);
                      const isFree = highlight.freeTeacherIdsAtTimeslot.includes(teacher.id) && !hasOwn && !hasSub;
                      return isFree;
                    }
                    return isLessonHighlighted(teacher.id, lessonNumber, lesson);
                  }}
                  onLessonHoverChange={(lessonNumber, lesson, hovered) => {
                    if (!lesson) return;
                    const payload = onTeacherDayHoverChange(teacher.id, dayOfWeek, lessonNumber, hovered);
                    setHoverLinked(payload);
                  }}
                  isLessonHoverLinked={(lessonNumber) => {
                    return isTeacherDayHoverLinked(teacher.id, dayOfWeek, lessonNumber, highlight.hoverLinked);
                  }}
                  enableEmptyClick={Boolean(highlight.substitutionMode)}
                  onEmptyCellClick={(lessonNumber) => {
                    if (!highlight.substitutionMode || !highlight.freeTeacherIdsAtTimeslot) return;
                    if (lessonNumber !== highlight.substitutionMode.lessonNumber) return;
                    if (!highlight.freeTeacherIdsAtTimeslot.includes(teacher.id)) return;
                    setSelectedSubstituteTeacherId(teacher.id);
                    setModalOpen(true);
                  }}
                  isEmptyCellHighlighted={(lessonNumber) => {
                    if (!highlight.substitutionMode || !highlight.freeTeacherIdsAtTimeslot) return false;
                    if (lessonNumber !== highlight.substitutionMode.lessonNumber) return false;
                    const hasOwn = lessons.some(l => l.idTeacher === teacher.id && l.dayOfWeek === dayOfWeek && l.lessonNumber === lessonNumber);
                    const hasSub = lessons.some(l => l.idTeacher === teacher.id && l.dayOfWeek === dayOfWeek && l.lessonNumber === lessonNumber && l.substitution && l.substitution.idTeacher === teacher.id);
                    return highlight.freeTeacherIdsAtTimeslot.includes(teacher.id) && !hasOwn && !hasSub;
                  }}
                />
              </ScheduleTableCell>
            </ScheduleTableRow>
          ))}
        </ScheduleTableBody>
      </ScheduleTable>
      <CreateSubstitutionModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); exitSubstitutionMode(); }}
        teachers={teachers}
        substituteTeacherId={selectedSubstituteTeacherId ?? 0}
      />
    </ScheduleContainer>
  );
};

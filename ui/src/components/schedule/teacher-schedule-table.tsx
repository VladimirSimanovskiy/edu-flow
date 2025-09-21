import React, { useState } from 'react';
import type { Teacher, Lesson } from '../../types/schedule';
import { WeekScheduleTable } from './base/week-schedule-table';
import { teacherToScheduleEntity, getLessonForTeacher } from './adapters/schedule-adapters';
import { useTeacherScheduleStore } from '../../store/teacherScheduleStore';
import { useScheduleFiltersContext } from './filters';
import type { LessonData } from './base/lesson-cell';
import { useSubstitutionHover } from './hooks/useSubstitutionHover';
import { apiClient } from '../../lib/api';
import { CreateSubstitutionModal } from './modals/create-substitution-modal';

interface TeacherScheduleTableProps {
  teachers: Teacher[];
  lessons: Lesson[];
  weekStart: Date;
  className?: string;
  /**
   * Включить drag n scroll функциональность
   * @default true
   */
  enableDragScroll?: boolean;
}

export const TeacherScheduleTable: React.FC<TeacherScheduleTableProps> = ({
  teachers,
  lessons,
  weekStart,
  className,
  enableDragScroll = true,
}) => {
  const { highlight, setHighlightedClass, clearHighlight, setHoverLinked } = useTeacherScheduleStore();
  const { onTeacherWeekHoverChange, isTeacherWeekHoverLinked } = useSubstitutionHover(lessons);
  const { enterSubstitutionMode, exitSubstitutionMode } = useTeacherScheduleStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSubstituteTeacherId, setSelectedSubstituteTeacherId] = useState<number | null>(null);
  
  // Get filters from context
  const {
    getTeacherFilterOptions,
    isTeacherFilterActive,
    isTeacherVisible,
  } = useScheduleFiltersContext();
  
  const teacherFilterOptions = getTeacherFilterOptions(teachers);

  const scheduleEntities = teachers.map(teacherToScheduleEntity);
  
  // Filter teachers based on filter state
  const filteredTeachers = teachers.filter(teacher => isTeacherVisible(teacher.id));
  const filteredScheduleEntities = filteredTeachers.map(teacherToScheduleEntity);

  // Обработчик клика по уроку в расписании учителей
  const handleLessonClick = (teacherId: number, day: Date, lessonNumber: number, lesson: LessonData) => {
    const className = lesson.primary;
    
    if (!className) return;

    // Находим класс по названию
    const classItem = lessons.find(l => 
      l.idTeacher === teacherId && 
      l.dayOfWeek === (day.getDay() === 0 ? 7 : day.getDay()) &&
      l.lessonNumber === lessonNumber
    );

    if (!classItem) return;

    const classId = classItem.idClass;
    const currentHighlightedClassId = highlight.highlightedClassId;

    // Если кликнули по тому же классу - снимаем подсветку
    if (currentHighlightedClassId === classId) {
      clearHighlight();
    } else {
      // Иначе подсвечиваем новый класс
      setHighlightedClass(classId, day);
    }
  };

  // Контекстное меню для создания замещения — сразу входим в режим замещения
  const handleLessonContextMenu = (teacherId: number, day: Date, lessonNumber: number, lesson: LessonData) => {
    if (!lesson || lesson.isSubstitution || lesson.isReplacedOriginal) return;
    const dbDay = (day.getDay() === 0 ? 7 : day.getDay());
    const lessonData = lessons.find(l => 
      l.idTeacher === teacherId && 
      l.dayOfWeek === dbDay &&
      l.lessonNumber === lessonNumber
    );
    if (!lessonData) return;

    const freeTeacherIds = teachers
      .filter(t => {
        const hasOwnLesson = lessons.some(l => l.idTeacher === t.id && l.dayOfWeek === dbDay && l.lessonNumber === lessonNumber);
        const hasSubstitution = lessons.some(l => l.dayOfWeek === dbDay && l.lessonNumber === lessonNumber && l.substitution && l.substitution.idTeacher === t.id);
        return !hasOwnLesson && !hasSubstitution;
      })
      .map(t => t.id);

    const dateStr = day.toISOString().split('T')[0];
    enterSubstitutionMode({
      date: dateStr,
      lessonNumber,
      idOriginalLesson: lessonData.id,
      idOriginalTeacher: teacherId,
      classId: lessonData.idClass,
    }, freeTeacherIds);
  };

  // Проверка, должен ли урок быть подсвечен (для занятых ячеек — обычно false в режиме замещения)
  const isLessonHighlighted = (teacherId: number, day: Date, lessonNumber: number, _lesson: LessonData): boolean => {
    // Ограничиваем подсветку только выбранным днем и номером урока
    if (highlight.substitutionMode) {
      const mode = highlight.substitutionMode;
      const dayStr = day.toISOString().split('T')[0];
      if (dayStr !== mode.date || lessonNumber !== mode.lessonNumber) return false;
    }

    const dbDay = (day.getDay() === 0 ? 7 : day.getDay());

    if (!highlight.highlightedClassId) return false;

    // Находим урок и проверяем, что это тот же класс
    const lessonData = lessons.find(l => 
      l.idTeacher === teacherId && 
      l.dayOfWeek === dbDay &&
      l.lessonNumber === lessonNumber
    );

    return lessonData ? lessonData.idClass === highlight.highlightedClassId : false;
  };

  return (
    <>
    <WeekScheduleTable
      entities={scheduleEntities}
      lessons={lessons}
      weekStart={weekStart}
      className={className}
      getLessonForEntity={(teacherId, day, lessonNumber) => 
        getLessonForTeacher(lessons, teacherId, day, lessonNumber)
      }
      entityLabel="Учителя"
      onLessonClick={handleLessonClick}
      onLessonContextMenu={(entityId, day, lessonNumber, lsn) => handleLessonContextMenu(entityId, day, lessonNumber, lsn)}
      isLessonHighlighted={(entityId, day, lessonNumber, lsn) => {
        // Подсветка свободных ячеек для режима замещения — только выбранный день и номер урока
        if (highlight.substitutionMode && highlight.freeTeacherIdsAtTimeslot) {
          const mode = highlight.substitutionMode;
          const dayStr = day.toISOString().split('T')[0];
          if (dayStr !== mode.date || lessonNumber !== mode.lessonNumber) return false;
          const dbDay = (day.getDay() === 0 ? 7 : day.getDay());
          const hasOwn = lessons.some(l => l.idTeacher === entityId && l.dayOfWeek === dbDay && l.lessonNumber === lessonNumber);
          const hasSub = lessons.some(l => l.dayOfWeek === dbDay && l.lessonNumber === lessonNumber && l.substitution && l.substitution.idTeacher === entityId);
          const isFree = highlight.freeTeacherIdsAtTimeslot.includes(entityId) && !hasOwn && !hasSub;
          return isFree;
        }
        return isLessonHighlighted(entityId, day, lessonNumber, lsn);
      }}
      enableDragScroll={enableDragScroll}
      filterOptions={teacherFilterOptions}
      isFilterActive={isTeacherFilterActive}
      filteredEntities={filteredScheduleEntities}
      onLessonHoverChange={(teacherId, day, lessonNumber, lesson, hovered) => {
        if (!lesson) return setHoverLinked(undefined);
        const payload = onTeacherWeekHoverChange(teacherId, day, lessonNumber, hovered);
        setHoverLinked(payload);
      }}
      isLessonHoverLinked={(teacherId, day, lessonNumber, _lesson) => {
        return isTeacherWeekHoverLinked(teacherId, day, lessonNumber, highlight.hoverLinked);
      }}
      enableEmptyClick={Boolean(highlight.substitutionMode)}
      onEmptyCellClick={(teacherId, day, lessonNumber) => {
        if (!highlight.substitutionMode || !highlight.freeTeacherIdsAtTimeslot) return;
        // Разрешаем клик только на выбранный день и номер урока
        const mode = highlight.substitutionMode;
        const dayStr = day.toISOString().split('T')[0];
        if (dayStr !== mode.date || lessonNumber !== mode.lessonNumber) return;
        if (!highlight.freeTeacherIdsAtTimeslot.includes(teacherId)) return;
        setSelectedSubstituteTeacherId(teacherId);
        setModalOpen(true);
      }}
      isEmptyCellHighlighted={(teacherId, day, lessonNumber) => {
        if (!highlight.substitutionMode || !highlight.freeTeacherIdsAtTimeslot) return false;
        const mode = highlight.substitutionMode;
        const dayStr = day.toISOString().split('T')[0];
        if (dayStr !== mode.date || lessonNumber !== mode.lessonNumber) return false;
        const dbDay = (day.getDay() === 0 ? 7 : day.getDay());
        const hasOwn = lessons.some(l => l.idTeacher === teacherId && l.dayOfWeek === dbDay && l.lessonNumber === lessonNumber);
        const hasSub = lessons.some(l => l.dayOfWeek === dbDay && l.lessonNumber === lessonNumber && l.substitution && l.substitution.idTeacher === teacherId);
        return highlight.freeTeacherIdsAtTimeslot.includes(teacherId) && !hasOwn && !hasSub;
      }}
    />
    <CreateSubstitutionModal
      open={modalOpen}
      onClose={() => { setModalOpen(false); exitSubstitutionMode(); }}
      teachers={teachers}
      substituteTeacherId={selectedSubstituteTeacherId ?? 0}
    />
    </>
  );
}

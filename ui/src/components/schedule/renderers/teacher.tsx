import React, { useState } from 'react';
import { GridRenderer } from '../ui/table/grid-renderer';
import { buildLessonMatrix } from '../core/matrix';
import type { Lesson, Teacher, Class } from '@/types/schedule';
import { DayViewStrategy, WeekViewStrategy } from '../core/time';
import { useLessonNumbers } from '../hooks';
import { TeacherDimensionStrategy } from '../core/entity';
import type { ViewType } from '@/types/scheduleConfig';
import { LessonCell, type LessonData } from '../ui/table/lesson-cell';
import { useScheduleFiltersContext } from '../filters/context/ScheduleFiltersContext';
import { ScheduleColumnFilter } from '../filters/schedule-column-filter';
import { getFeatureFlags } from '../config';
import { useTeacherScheduleStore, useSubstitutionHover, SubstitutionUI } from '../features';
import {
	ContextMenu,
	ContextMenuTrigger,
	ContextMenuContent,
	ContextMenuItem,
} from '../../ui/context-menu';
import { useQueryClient } from '@tanstack/react-query';
import { startOfWeek, addDays } from 'date-fns';
import { apiClient } from '../api';

interface Props {
	viewType: ViewType;
	date: Date;
	lessons: Lesson[];
	teachers?: Teacher[];
	classes?: Class[];
}

export const TeacherGrid: React.FC<Props> = ({ viewType, date, lessons, teachers, classes }) => {
	const { isTeacherVisible, getTeacherFilterOptions, isTeacherFilterActive } =
		useScheduleFiltersContext();
	const { lessonNumbers } = useLessonNumbers();
	const timeView =
		viewType === 'day'
			? new DayViewStrategy(lessonNumbers)
			: new WeekViewStrategy(lessonNumbers);
	const entity = new TeacherDimensionStrategy(isTeacherVisible);
	const model = buildLessonMatrix({
		lessons,
		date,
		timeView,
		entity,
		entities: { teachers, classes },
	});

	const flags = getFeatureFlags('teachers', viewType);
	const {
		highlight,
		setHighlightedClass,
		clearHighlight,
		setHoverLinked,
		enterSubstitutionMode,
		exitSubstitutionMode,
	} = useTeacherScheduleStore();
	const {
		onTeacherWeekHoverChange,
		isTeacherWeekHoverLinked,
		onTeacherDayHoverChange,
		isTeacherDayHoverLinked,
	} = useSubstitutionHover(lessons);
	const [modalOpen, setModalOpen] = useState(false);
	const [selectedSubstituteTeacherId, setSelectedSubstituteTeacherId] = useState<number | null>(
		null
	);
	const queryClient = useQueryClient();

	const renderCellContent = (cell: {
		rowId: number;
		columnKey: string;
		lessons: Lesson[];
	}): React.ReactNode => {
		const teacherId = cell.rowId;
		// Determine slot (day/lesson)
		const dayOfWeek = viewType === 'day' ? date.getDay() : Number(cell.columnKey.split('-')[0]);
		const lessonNumber =
			viewType === 'day' ? Number(cell.columnKey) : Number(cell.columnKey.split('-')[1]);

		// Compute cell date early for helpers below
		const cellDate = (() => {
			if (viewType === 'day') return date;
			const dayIndex = Number(cell.columnKey.split('-')[0]) - 1; // 0..4
			const base = startOfWeek(date, { weekStartsOn: 1 });
			return addDays(base, dayIndex);
		})();

		// Resolve direct lesson and substitution (support both singular 'substitution' and weekly 'substitutions[]')
		const toDateKey = (d?: Date | string) => {
			if (!d) return '';
			if (typeof d === 'string') return d.slice(0, 10);
			const y = d.getFullYear();
			const m = String(d.getMonth() + 1).padStart(2, '0');
			const dd = String(d.getDate()).padStart(2, '0');
			return `${y}-${m}-${dd}`;
		};
		const sameDate = (a?: Date | string, b?: Date) => toDateKey(a) === toDateKey(b);

		const getActiveSubstitutionForLesson = (l: Lesson) => {
			const single = (l as any).substitution as
				| undefined
				| { id: number; date: Date | string; idTeacher: number; classroomNumber?: number };
			if (single && sameDate(single.date, cellDate)) return single;
			const arr = (l as any).substitutions as
				| Array<{
						id: number;
						date: Date | string;
						idTeacher: number;
						classroomNumber?: number;
				  }>
				| undefined;
			return arr?.find(s => sameDate(s.date, cellDate));
		};

		const direct = lessons.find(
			l =>
				l.idTeacher === teacherId &&
				l.dayOfWeek === dayOfWeek &&
				l.lessonNumber === lessonNumber
		);
		const directActiveSub = direct ? getActiveSubstitutionForLesson(direct) : undefined;

		// Find original lesson which has a substitution to this teacher on this date
		const subSourceLesson = lessons.find(
			l =>
				l.dayOfWeek === dayOfWeek &&
				l.lessonNumber === lessonNumber &&
				(() => {
					const s = getActiveSubstitutionForLesson(l);
					return Boolean(s && s.idTeacher === teacherId);
				})()
		);
		const subRecord = subSourceLesson
			? getActiveSubstitutionForLesson(subSourceLesson)
			: undefined;

		// Decide what content to show in this cell
		const content = subRecord ? subSourceLesson : direct || undefined;
		const isSub = Boolean(subRecord && (!direct || direct.id !== teacherId));
		const isReplaced = Boolean(direct && directActiveSub);

		const displayClassroomNumber = isSub
			? ((subRecord as any)?.classroomNumber ?? content?.classroomNumber)
			: content?.classroomNumber;

		const lessonData: LessonData | undefined = content
			? {
					primary: content.className,
					secondary: [
						content.subjectName,
						displayClassroomNumber ? `каб. ${displayClassroomNumber}` : undefined,
					].filter(Boolean) as string[],
					isSubstitution: isSub,
					isReplacedOriginal: !isSub && isReplaced,
				}
			: undefined;

		const isHighlighted = () => {
			if (!flags.highlight) return false;
			if (viewType === 'week' && highlight.substitutionMode) {
				// В недельном виде подсветка доступных пустых слотов обрабатывается ниже
				return false;
			}
			if (!highlight.highlightedClassId) return false;
			if (!content) return false;
			return content.idClass === highlight.highlightedClassId;
		};

		const onClick =
			content && flags.highlight
				? () => {
						const classId = content.idClass;
						const current = highlight.highlightedClassId;
						if (current === classId) clearHighlight();
						else setHighlightedClass(classId, date);
					}
				: undefined;

		// Context menu actions for substitution
		const originalLessonForSlot = direct || subSourceLesson;
		const canCreateSubstitution = Boolean(
			flags.substitution &&
				originalLessonForSlot &&
				!getActiveSubstitutionForLesson(originalLessonForSlot)
		);
		const canDeleteSubstitution = Boolean(flags.substitution && (directActiveSub || subRecord));

		const handleCreateSubstitution = () => {
			if (!originalLessonForSlot) return;
			const freeTeacherIds: number[] = (teachers || [])
				.filter(t => {
					const hasOwn = lessons.some(
						l =>
							l.idTeacher === t.id &&
							l.dayOfWeek === dayOfWeek &&
							l.lessonNumber === lessonNumber
					);
					const hasSub = lessons.some(l => {
						const s = getActiveSubstitutionForLesson(l);
						return (
							l.dayOfWeek === dayOfWeek &&
							l.lessonNumber === lessonNumber &&
							Boolean(s && s.idTeacher === t.id)
						);
					});
					return !hasOwn && !hasSub;
				})
				.map(t => t.id);
			const theDate =
				viewType === 'day'
					? date
					: addDays(
							startOfWeek(date, { weekStartsOn: 1 }),
							Number(cell.columnKey.split('-')[0]) - 1
						);
			const dateStr = toDateKey(theDate);
			enterSubstitutionMode(
				{
					date: dateStr,
					lessonNumber,
					idOriginalLesson: originalLessonForSlot.id,
					idOriginalTeacher: originalLessonForSlot.idTeacher,
					classId: originalLessonForSlot.idClass,
				},
				freeTeacherIds
			);
		};

		const handleDeleteSubstitution = async () => {
			const subId = (directActiveSub || subRecord)?.id as number | undefined;
			if (!subId) return;
			await apiClient.deleteSubstitution(subId);
			await queryClient.invalidateQueries({ queryKey: ['lessons'] });
		};

		const onMouseEnter =
			content && flags.hoverLink
				? () => {
						const payload =
							viewType === 'week'
								? onTeacherWeekHoverChange(teacherId, date, lessonNumber, true)
								: onTeacherDayHoverChange(teacherId, dayOfWeek, lessonNumber, true);
						setHoverLinked(payload);
					}
				: undefined;

		const onMouseLeave =
			content && flags.hoverLink
				? () => {
						const payload =
							viewType === 'week'
								? onTeacherWeekHoverChange(teacherId, date, lessonNumber, false)
								: onTeacherDayHoverChange(
										teacherId,
										dayOfWeek,
										lessonNumber,
										false
									);
						setHoverLinked(payload);
					}
				: undefined;

		const isHoverLinked = () => {
			if (!flags.hoverLink || !content) return false;
			return viewType === 'week'
				? isTeacherWeekHoverLinked(teacherId, date, lessonNumber, highlight.hoverLinked)
				: isTeacherDayHoverLinked(
						teacherId,
						dayOfWeek,
						lessonNumber,
						highlight.hoverLinked
					);
		};

		// Подсветка пустых ячеек для режима замещения
		const isEmptySlotHighlighted = (() => {
			if (!flags.substitution) return false;
			const mode = highlight.substitutionMode;
			if (!mode) return false;
			// Сопоставляем выбранный слот
			const isSameSlot =
				mode.lessonNumber === lessonNumber && toDateKey(mode.date) === toDateKey(cellDate);
			if (!isSameSlot) return false;
			// Проверяем доступность учителя
			if (
				highlight.freeTeacherIdsAtTimeslot &&
				!highlight.freeTeacherIdsAtTimeslot.includes(teacherId)
			)
				return false;
			// Fallback вычисление, если freeTeacherIdsAtTimeslot отсутствует
			const hasOwn = lessons.some(
				l =>
					l.idTeacher === teacherId &&
					l.dayOfWeek === dayOfWeek &&
					l.lessonNumber === lessonNumber
			);
			const hasSub = lessons.some(l => {
				if (l.dayOfWeek !== dayOfWeek || l.lessonNumber !== lessonNumber) return false;
				const s = getActiveSubstitutionForLesson(l);
				return Boolean(s && s.idTeacher === teacherId);
			});
			return !hasOwn && !hasSub;
		})();

		const baseCell = (
			<LessonCell
				lesson={lessonData}
				lessonNumber={lessonNumber}
				onClick={onClick}
				isHighlighted={isHighlighted() || (!content && isEmptySlotHighlighted)}
				onMouseEnter={onMouseEnter}
				onMouseLeave={onMouseLeave}
				isHoverLinked={isHoverLinked()}
				enableEmptyClick={Boolean(flags.substitution && highlight.substitutionMode)}
				onEmptyClick={
					flags.substitution
						? () => {
								const mode = highlight.substitutionMode;
								if (!mode || !highlight.freeTeacherIdsAtTimeslot) return;
								// Allow click ONLY on the exact selected slot (date + lessonNumber)
								const isSameSlot =
									mode.lessonNumber === lessonNumber &&
									toDateKey(mode.date) === toDateKey(cellDate);
								if (!isSameSlot) return;
								if (!highlight.freeTeacherIdsAtTimeslot.includes(teacherId)) return;
								setSelectedSubstituteTeacherId(teacherId);
								setModalOpen(true);
							}
						: undefined
				}
			/>
		);

		if (flags.substitution && (canCreateSubstitution || canDeleteSubstitution)) {
			return (
				<ContextMenu>
					<ContextMenuTrigger>{baseCell}</ContextMenuTrigger>
					<ContextMenuContent>
						{canCreateSubstitution && (
							<ContextMenuItem onSelect={handleCreateSubstitution}>
								Создать замещение
							</ContextMenuItem>
						)}
						{canDeleteSubstitution && (
							<ContextMenuItem onSelect={handleDeleteSubstitution}>
								Удалить замещение
							</ContextMenuItem>
						)}
					</ContextMenuContent>
				</ContextMenu>
			);
		}

		return baseCell;
	};

	return (
		<>
			<GridRenderer
				model={model}
				renderCell={renderCellContent}
				enableDragScroll={viewType === 'week'}
				rowHeaderLabel="Учителя"
				rowHeaderControls={
					<ScheduleColumnFilter
						options={getTeacherFilterOptions(teachers || [])}
						isActive={isTeacherFilterActive}
					/>
				}
			/>
			{flags.substitution && (
				<SubstitutionUI.CreateSubstitutionModal
					open={modalOpen}
					onClose={() => {
						setModalOpen(false);
						exitSubstitutionMode();
					}}
					teachers={teachers || []}
					substituteTeacherId={selectedSubstituteTeacherId ?? 0}
				/>
			)}
		</>
	);
};

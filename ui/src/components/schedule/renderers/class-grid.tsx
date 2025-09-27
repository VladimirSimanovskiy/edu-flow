import React from 'react';
import { GridRenderer } from '../presenters/GridRenderer';
import { buildLessonMatrix } from '../core/matrix';
import type { Lesson, Teacher, Class } from '../../../types/schedule';
import { DayViewStrategy } from '../strategies/time/DayViewStrategy';
import { WeekViewStrategy } from '../strategies/time/WeekViewStrategy';
import { useLessonNumbers } from '../model/logic';
import { ClassDimensionStrategy } from '../strategies/entity/ClassDimensionStrategy';
import type { ViewType } from '../../../types/scheduleConfig';
import { LessonCell, type LessonData } from '../ui/table';
import { useScheduleFiltersContext } from '../model/filters';
import { ScheduleColumnFilter } from '../model/filters';
import { getFeatureFlags } from '../config';
import { useClassScheduleStore } from '../features';

interface Props {
	viewType: ViewType;
	date: Date;
	lessons: Lesson[];
	teachers?: Teacher[];
	classes?: Class[];
}

export const ClassGrid: React.FC<Props> = ({ viewType, date, lessons, teachers, classes }) => {
	const { isClassVisible } = useScheduleFiltersContext();
	const { lessonNumbers } = useLessonNumbers();
	const timeView =
		viewType === 'day'
			? new DayViewStrategy(lessonNumbers)
			: new WeekViewStrategy(lessonNumbers);
	const entity = new ClassDimensionStrategy(isClassVisible);
	const model = buildLessonMatrix({
		lessons,
		date,
		timeView,
		entity,
		entities: { teachers, classes },
	});

	const { highlight } = useClassScheduleStore();
	const flags = getFeatureFlags('classes', viewType);

	const renderCellContent = (cell: {
		rowId: number;
		columnKey: string;
		lessons: Lesson[];
	}): React.ReactNode => {
		const content = cell.lessons[0];
		const lessonNumber =
			viewType === 'day'
				? (content?.lessonNumber ?? Number(cell.columnKey))
				: Number(cell.columnKey.split('-')[1]);

		const lessonData: LessonData | undefined = content
			? {
					primary: content.subjectName,
					secondary: [content.teacherName, `каб. ${content.classroomNumber}`].filter(
						Boolean
					) as string[],
					isSubstitution: Boolean((content as any).substitution),
				}
			: undefined;

		const isHighlighted = () => {
			if (!flags.highlight) return false;
			if (!content) return false;
			return content.idTeacher === highlight.highlightedTeacherId;
		};

		return (
			<LessonCell
				lesson={lessonData}
				lessonNumber={lessonNumber}
				isHighlighted={isHighlighted()}
			/>
		);
	};

	return (
		<GridRenderer
			model={model}
			renderCell={renderCellContent}
			enableDragScroll={viewType === 'week'}
			rowHeaderLabel="Классы"
			rowHeaderControls={
				<ScheduleColumnFilter
					options={getClassFilterOptions(classes || [])}
					isActive={isClassFilterActive}
				/>
			}
		/>
	);
};

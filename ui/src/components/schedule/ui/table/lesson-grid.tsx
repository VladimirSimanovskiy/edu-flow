import React from 'react';
import { cn } from '../../../../utils/cn';
import { LessonCell, type LessonData } from './lesson-cell';
import {
	ContextMenu,
	ContextMenuTrigger,
	ContextMenuContent,
	ContextMenuItem,
} from '../../../../components/ui/context-menu';

interface LessonGridProps {
	lessonNumbers: number[];
	getLesson: (lessonNumber: number) => LessonData | undefined;
	className?: string;
	onLessonClick?: (lessonNumber: number, lesson: LessonData) => void;
	onLessonContextMenu?: (lessonNumber: number, lesson: LessonData) => void;
	isLessonHighlighted?: (lessonNumber: number, lesson: LessonData) => boolean;
	onLessonHoverChange?: (
		lessonNumber: number,
		lesson: LessonData | undefined,
		hovered: boolean
	) => void;
	isLessonHoverLinked?: (lessonNumber: number, lesson: LessonData) => boolean;
	enableEmptyClick?: boolean;
	onEmptyCellClick?: (lessonNumber: number) => void;
	isEmptyCellHighlighted?: (lessonNumber: number) => boolean;
	onLessonDeleteSubstitution?: (lessonNumber: number, lesson: LessonData) => void;
}

export const LessonGrid: React.FC<LessonGridProps> = ({
	lessonNumbers,
	getLesson,
	className,
	onLessonClick,
	onLessonContextMenu,
	isLessonHighlighted,
	onLessonHoverChange,
	isLessonHoverLinked,
	enableEmptyClick,
	onEmptyCellClick,
	isEmptyCellHighlighted,
	onLessonDeleteSubstitution,
}) => {
	return (
		<div
			className={cn('grid gap-0.5 sm:gap-1 md:gap-1.5', className)}
			style={{
				gridTemplateColumns: `repeat(${lessonNumbers?.length ?? 0}, minmax(5rem, 1fr))`,
			}}
		>
			{lessonNumbers?.map(lessonNumber => {
				const lesson = getLesson(lessonNumber);
				const isHighlighted = lesson
					? isLessonHighlighted
						? isLessonHighlighted(lessonNumber, lesson)
						: false
					: isEmptyCellHighlighted
						? isEmptyCellHighlighted(lessonNumber)
						: false;
				const isHoverLinked =
					lesson && isLessonHoverLinked
						? isLessonHoverLinked(lessonNumber, lesson)
						: false;
				const cell = (
					<LessonCell
						key={lessonNumber}
						lesson={lesson}
						lessonNumber={lessonNumber}
						onClick={
							lesson && onLessonClick
								? () => onLessonClick(lessonNumber, lesson)
								: undefined
						}
						isHighlighted={isHighlighted}
						isHoverLinked={isHoverLinked}
						onMouseEnter={
							lesson && onLessonHoverChange
								? () => onLessonHoverChange(lessonNumber, lesson, true)
								: undefined
						}
						onMouseLeave={
							lesson && onLessonHoverChange
								? () => onLessonHoverChange(lessonNumber, lesson, false)
								: undefined
						}
						enableEmptyClick={Boolean(enableEmptyClick)}
						onEmptyClick={
							onEmptyCellClick ? () => onEmptyCellClick(lessonNumber) : undefined
						}
					/>
				);

				if (!lesson) {
					return cell;
				}

				const canCreateSubstitution = !lesson.isSubstitution && !lesson.isReplacedOriginal;
				const canDeleteSubstitution = Boolean(lesson.isSubstitution);

				if (!onLessonContextMenu && !onLessonDeleteSubstitution) {
					return cell;
				}

				return (
					<ContextMenu key={lessonNumber}>
						<ContextMenuTrigger>{cell}</ContextMenuTrigger>
						<ContextMenuContent>
							{canCreateSubstitution && onLessonContextMenu ? (
								<ContextMenuItem
									onSelect={() => onLessonContextMenu(lessonNumber, lesson)}
								>
									Создать замещение
								</ContextMenuItem>
							) : null}
							{canDeleteSubstitution && onLessonDeleteSubstitution ? (
								<ContextMenuItem
									onSelect={() =>
										onLessonDeleteSubstitution(lessonNumber, lesson)
									}
								>
									Удалить замещение
								</ContextMenuItem>
							) : null}
						</ContextMenuContent>
					</ContextMenu>
				);
			})}
		</div>
	);
};
